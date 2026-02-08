import { NextResponse } from 'next/server';
import { getTreasurySnapshot } from '@/lib/treasury/snapshot';

export async function GET() {
    return NextResponse.json(getTreasurySnapshot());
}
