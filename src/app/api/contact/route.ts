import { NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

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

    try {
        await emailService.sendContactInquiry({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            company: company?.trim(),
            investorType: investorType?.trim(),
            message: message.trim(),
        });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: 'Unable to send your inquiry. Please try again.' }, { status: 500 });
    }
}
