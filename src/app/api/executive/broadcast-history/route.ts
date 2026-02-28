import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as { role?: string } | null;
    if (!token || (token.role !== 'EXECUTIVE' && token.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    try {
        const [logs, total] = await Promise.all([
            prisma.broadcastLog.findMany({
                orderBy: { sentAt: 'desc' },
                take: limit,
                skip: offset,
                select: {
                    id: true,
                    subject: true,
                    message: true,
                    sentByEmail: true,
                    sentAt: true,
                    recipientCount: true,
                },
            }),
            prisma.broadcastLog.count(),
        ]);

        return NextResponse.json({
            ok: true,
            logs,
            total,
            limit,
            offset,
        });
    } catch (err) {
        console.error('Failed to fetch broadcast history:', err);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
