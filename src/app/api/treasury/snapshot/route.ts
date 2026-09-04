import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getTreasurySnapshotLive } from '@/lib/treasury/snapshot';

export const dynamic = 'force-dynamic';

/**
 * Treasury snapshot for signed-in portal users only. The public site does not
 * publish treasury figures; this endpoint backs the authenticated dashboards.
 */
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const snapshot = await getTreasurySnapshotLive();
    return NextResponse.json(snapshot, { headers: { 'Cache-Control': 'private, no-store' } });
}
