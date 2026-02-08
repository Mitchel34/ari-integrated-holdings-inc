import { NextResponse } from 'next/server';
import { getDisclosures } from '@/lib/investor/disclosures';

export async function GET() {
    return NextResponse.json({
        disclosures: getDisclosures(),
    });
}
