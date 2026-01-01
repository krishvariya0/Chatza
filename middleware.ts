import { NextRequest, NextResponse } from "next/server";

// Auth routes - redirect to home if user is logged in
const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/forgotpassword"
];

// Protected routes - require authentication
const protectedRoutes = [
    "/home",
    "/feed",
    "/find",
    "/explore",
    "/chat",
    "/updates",
    "/create",
    "/profile",
    "/onboarding"
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get("session")?.value;

    // Allow API routes and static files to pass through
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".") ||
        pathname.startsWith("/favicon")
    ) {
        return NextResponse.next();
    }

    // Handle auth routes - redirect to home if user is logged in
    if (authRoutes.some(route => pathname.startsWith(route))) {
        if (sessionToken) {
            return NextResponse.redirect(new URL("/home", request.url));
        }
        return NextResponse.next();
    }

    // Handle public routes - allow access for everyone
    // Landing page and legal pages
    if (pathname === "/" || pathname.startsWith("/leagle")) {
        return NextResponse.next();
    }

    // Handle protected routes - require authentication
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!sessionToken) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // Default: allow request
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};