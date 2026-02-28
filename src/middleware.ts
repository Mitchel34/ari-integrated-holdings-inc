import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken, JWT } from 'next-auth/jwt'

interface ExtendedJWT extends JWT {
    role: "INVESTOR" | "EXECUTIVE" | "ADMIN";
}

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as ExtendedJWT | null;

    // Executive pages and API routes: require EXECUTIVE or ADMIN role
    if (path.startsWith('/executive') || path.startsWith('/api/executive')) {
        if (!token || (token.role !== 'EXECUTIVE' && token.role !== 'ADMIN')) {
            if (path.startsWith('/api/')) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            const url = new URL('/login', req.url);
            url.searchParams.set('callbackUrl', path);
            return NextResponse.redirect(url);
        }
    }

    // Investor portal pages: require any authenticated session
    if (path.startsWith('/investor')) {
        if (!token) {
            const url = new URL('/login', req.url);
            url.searchParams.set('callbackUrl', path);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/executive/:path*', '/investor/:path*', '/api/executive/:path*'],
}
