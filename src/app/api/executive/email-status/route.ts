import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { getEmailConfigStatus } from '@/lib/email';

/**
 * Executive-only diagnostics for outbound email: which settings are present
 * (never their values), where correspondence is routed, and which commit this
 * deployment was built from. Lets the team confirm a deployment's delivery
 * configuration without opening the hosting dashboard.
 */
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as { role?: string } | null;
    if (!token || (token.role !== 'EXECUTIVE' && token.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
        email: getEmailConfigStatus(),
        deployment: {
            environment: process.env.VERCEL_ENV ?? (process.env.NODE_ENV === 'production' ? 'production' : 'development'),
            commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
            branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
            url: process.env.VERCEL_URL ?? null,
        },
        checkedAt: new Date().toISOString(),
    });
}
