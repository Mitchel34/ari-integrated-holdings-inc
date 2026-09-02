import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { emailService } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

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

function clientKey(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    return `contact:${ip}`;
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

    // Honeypot: real users never see or fill this field. Pretend success for bots.
    if (typeof fields.website === 'string' && fields.website.trim().length > 0) {
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

    try {
        const sent = await emailService.sendContactInquiry({
            name,
            email,
            company: company || undefined,
            investorType: investorType || undefined,
            message,
        });
        if (!sent) {
            throw new Error('Delivery failed');
        }
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: 'Unable to send your inquiry. Please try again.' }, { status: 500 });
    }
}
