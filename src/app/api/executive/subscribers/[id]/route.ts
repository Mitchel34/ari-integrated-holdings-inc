import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, context: RouteContext) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as { role?: string } | null;
    if (!token || (token.role !== 'EXECUTIVE' && token.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await context.params;

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { isActive } = body as { isActive?: boolean };

    if (typeof isActive !== 'boolean') {
        return NextResponse.json({ error: 'isActive must be a boolean' }, { status: 400 });
    }

    try {
        const subscriber = await prisma.investorAlert.update({
            where: { id },
            data: { isActive },
        });

        return NextResponse.json({ ok: true, subscriber });
    } catch {
        return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as { role?: string } | null;
    if (!token || (token.role !== 'EXECUTIVE' && token.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await context.params;

    try {
        await prisma.investorAlert.delete({
            where: { id },
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }
}
