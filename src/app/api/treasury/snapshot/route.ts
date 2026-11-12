import { NextResponse } from 'next/server';
import { getTreasurySnapshotLive } from '@/lib/treasury/snapshot';

export const revalidate = 300; // 5-minute Next.js route cache

export async function GET() {
    const snapshot = await getTreasurySnapshotLive();
    return NextResponse.json(snapshot);
}
