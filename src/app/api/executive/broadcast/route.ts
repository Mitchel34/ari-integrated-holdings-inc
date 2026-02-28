import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

interface TokenWithUser {
    id?: string;
    email?: string;
    role?: string;
}

// Rate limit: 10 broadcasts per hour per user
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as TokenWithUser | null;
    if (!token || (token.role !== 'EXECUTIVE' && token.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check rate limit
    const rateLimitKey = `broadcast:${token.id || token.email}`;
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_WINDOW_MS);
    if (!rateLimit.allowed) {
        return NextResponse.json(
            {
                error: 'Rate limit exceeded. Please wait before sending more broadcasts.',
                resetAt: rateLimit.resetAt.toISOString(),
            },
            { status: 429 }
        );
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

    // Log the broadcast for audit trail
    if (token.id) {
        try {
            await prisma.broadcastLog.create({
                data: {
                    subject: subject.trim(),
                    message: message.trim(),
                    sentBy: token.id,
                    sentByEmail: token.email || 'unknown',
                    recipientCount: emails.length,
                },
            });
        } catch (err) {
            // Don't fail the request if logging fails
            console.error('Failed to log broadcast:', err);
        }
    }

    return NextResponse.json({ ok: true, sent: emails.length });
}
