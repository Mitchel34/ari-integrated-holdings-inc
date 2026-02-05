import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken, JWT } from 'next-auth/jwt'

interface ExtendedJWT extends JWT {
    role: "INVESTOR" | "EXECUTIVE" | "ADMIN";
}

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    if (path.startsWith('/executive')) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as ExtendedJWT | null;

        // If no token or role is not executive/admin, redirect to login
        if (!token || (token.role !== 'EXECUTIVE' && token.role !== 'ADMIN')) {
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
