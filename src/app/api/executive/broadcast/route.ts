import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as { role?: string } | null;
    if (!token || (token.role !== 'EXECUTIVE' && token.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { subject, message } = body as { subject?: string; message?: string };

    if (!subject?.trim() || !message?.trim()) {
        return NextResponse.json({ error: 'Subject and message are required.' }, { status: 400 });
    }

    const activeSubscribers = await prisma.investorAlert.findMany({
        where: { isActive: true },
        select: { email: true },
    });

    if (activeSubscribers.length === 0) {
        return NextResponse.json({ ok: true, sent: 0, message: 'No active subscribers.' });
    }

    const emails = activeSubscribers.map((s) => s.email);
    const ok = await emailService.sendTreasuryUpdateAlert(emails, subject.trim(), message.trim());

    if (!ok) {
        return NextResponse.json({ error: 'Email delivery failed. Check RESEND_API_KEY configuration.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, sent: emails.length });
}
