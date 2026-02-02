import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    if (path.startsWith('/executive')) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        // If no token or role is not executive, redirect to login
        if (!token || (token as any).role !== 'executive') {
            const url = new URL('/login', req.url);
            url.searchParams.set('callbackUrl', path);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/executive/:path*'],
}
