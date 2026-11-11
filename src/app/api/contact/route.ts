import { NextResponse } from 'next/server';
import { emailService, isEmailConfigured } from '@/lib/email';
import { CONTACT_EMAIL } from '@/lib/contact';

/** The inquiry was not delivered, so send the visitor to the contact address instead. */
function undelivered(status: 502 | 503) {
    return NextResponse.json(
        { error: `We could not deliver your inquiry. Please email ${CONTACT_EMAIL} directly.` },
        { status },
    );
}

export async function POST(req: Request) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, company, investorType, message } = body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    // Without a Resend key the email service only logs the message. That keeps
    // the form usable in local development, but in production it would drop
    // the inquiry while reporting success.
    if (!isEmailConfigured && process.env.NODE_ENV === 'production') {
        console.error('[Contact] Inquiry not delivered: RESEND_API_KEY is not set.');
        return undelivered(503);
    }

    let delivered = false;
    try {
        delivered = await emailService.sendContactInquiry({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            company: company?.trim(),
            investorType: investorType?.trim(),
            message: message.trim(),
        });
    } catch (err) {
        console.error('[Contact] Inquiry send failed:', err);
    }

    // sendContactInquiry resolves false when Resend rejects the message, for
    // example while the sender domain is still unverified.
    if (!delivered) {
        return undelivered(502);
    }

    return NextResponse.json({ ok: true });
}
