import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { emailService, type SendOutcome } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';
import { CONTACT } from '@/lib/site';

// Five inquiries per hour per client is generous for humans and blunts abuse.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const LIMITS = {
    name: 120,
    email: 254,
    company: 160,
    investorType: 80,
    message: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Unambiguous characters only (no 0/O or 1/I) so a reference can be read back over the phone. */
const REFERENCE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/**
 * Per-submission correlation id. It is returned to the visitor, placed in the
 * email subject and footer, tagged on the provider message, and written to the
 * server log, so any one of them can be traced to the others.
 */
function newReference(): string {
    const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const bytes = crypto.getRandomValues(new Uint8Array(6));
    let code = '';
    for (const byte of bytes) {
        code += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
    }
    return `ARI-${day}-${code}`;
}

function clientKey(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    return `contact:${ip}`;
}

/** Non-success response: nothing was handed to the provider, so the visitor must retry or email directly. */
function deliveryFailure(reference: string, status: number) {
    return NextResponse.json(
        {
            ok: false,
            delivery: 'failed',
            reference,
            error:
                `We could not deliver your inquiry. Your message is still in the form; please try again, ` +
                `or email ${CONTACT.email} directly and quote reference ${reference}.`,
        },
        { status },
    );
}

export async function POST(req: NextRequest) {
    const rateLimit = checkRateLimit(clientKey(req), RATE_LIMIT, RATE_WINDOW_MS);
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: 'Too many inquiries from this connection. Please try again later.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000)) } },
        );
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const fields = (body ?? {}) as Record<string, unknown>;
    const read = (key: keyof typeof LIMITS) => (typeof fields[key] === 'string' ? (fields[key] as string).trim() : '');
    const reference = newReference();

    // Honeypot: real users never see or fill this field. Bots get a bare fake
    // success (no reference, no delivery status) and nothing is sent. The log
    // line keeps it distinguishable from a real accepted inquiry.
    if (typeof fields.website === 'string' && fields.website.trim().length > 0) {
        console.info(`[contact] honeypot ref=${reference} outcome=fake_success (nothing sent)`);
        return NextResponse.json({ ok: true });
    }

    const name = read('name');
    const email = read('email').toLowerCase();
    const company = read('company');
    const investorType = read('investorType');
    const message = read('message');

    if (!name || !email || !message) {
        return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    if (!EMAIL_PATTERN.test(email)) {
        return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    for (const [key, max] of Object.entries(LIMITS) as [keyof typeof LIMITS, number][]) {
        const value = { name, email, company, investorType, message }[key];
        if (value.length > max) {
            return NextResponse.json({ error: `The ${key} field is too long.` }, { status: 400 });
        }
    }

    let outcome: SendOutcome;
    try {
        outcome = await emailService.sendContactInquiry({
            name,
            email,
            company: company || undefined,
            investorType: investorType || undefined,
            message,
            reference,
        });
    } catch (err) {
        console.error(`[contact] unexpected error ref=${reference}:`, err instanceof Error ? err.message : err);
        return deliveryFailure(reference, 500);
    }

    switch (outcome.status) {
        case 'accepted':
            // Provider acceptance only: the message is queued, not confirmed in an inbox.
            return NextResponse.json({ ok: true, delivery: 'accepted', reference });
        case 'dry-run':
            // Local opt-in mode (never production): logged, not delivered.
            return NextResponse.json({ ok: true, delivery: 'dry-run', reference });
        case 'failed':
            return deliveryFailure(reference, outcome.reason === 'not_configured' ? 503 : 502);
    }
}
