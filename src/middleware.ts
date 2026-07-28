import {NextRequest, NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
export {default} from 'next-auth/middleware';
import { getToken } from "next-auth/jwt";
import { Request } from 'next/dist/compiled/@edge-runtime/primitives';


export async function middleware(request: NextRequest) {

    const token = await getToken({req: request })
    const url = request.nextUrl
    
    return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
        '/',
        '/verify/:path*',
    
    ]
};