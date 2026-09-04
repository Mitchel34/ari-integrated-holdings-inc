import { NextResponse } from 'next/server';
import { getCompanyUpdates } from '@/lib/investor/updates';

/** Public JSON feed of company updates. */
export async function GET() {
    return NextResponse.json({
        updates: getCompanyUpdates(),
    });
}
