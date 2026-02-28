import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as { role?: string } | null;
    if (!token || (token.role !== 'EXECUTIVE' && token.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [subscribers, total] = await Promise.all([
        prisma.investorAlert.findMany({
            orderBy: { subscribedAt: 'desc' },
            take: 50,
        }),
        prisma.investorAlert.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({ subscribers, total });
}
