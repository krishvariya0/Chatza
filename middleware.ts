import { NextRequest, NextResponse } from "next/server";

// Auth routes - redirect based on onboarding status if user is logged in
const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/forgotpassword"
];

// Protected routes that require COMPLETED onboarding
const protectedRoutes = [
    "/home",
    "/feed",
    "/find",
    "/explore",
    "/chat",
    "/updates",
    "/create",
    "/profile"
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get("session")?.value;

    // Read onboarding status from cookie (set during login/register)
    const onboardingCompletedCookie = request.cookies.get("onboarding_completed")?.value;
    const onboardingCompleted = onboardingCompletedCookie === "true";

    // Allow API routes and static files to pass through
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".") ||
        pathname.startsWith("/favicon")
    ) {
        return NextResponse.next();
    }

    // Handle public routes - allow access for everyone
    // Landing page and legal pages
    if (pathname === "/" || pathname.startsWith("/leagle")) {
        return NextResponse.next();
    }

    // If user has session, check onboarding status
    if (sessionToken) {
        // Special handling for onboarding route
        if (pathname.startsWith("/onboarding")) {
            if (onboardingCompleted) {
                // User already completed onboarding, redirect to home
                return NextResponse.redirect(new URL("/home", request.url));
            }
            // User hasn't completed onboarding, allow access
            return NextResponse.next();
        }

        // For auth routes (login/register), redirect based on onboarding status
        if (authRoutes.some(route => pathname.startsWith(route))) {
            if (onboardingCompleted) {
                return NextResponse.redirect(new URL("/home", request.url));
            } else {
                return NextResponse.redirect(new URL("/onboarding", request.url));
            }
        }

        // For protected routes, check onboarding completion
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
            if (!onboardingCompleted) {
                // User hasn't completed onboarding, redirect to onboarding
                return NextResponse.redirect(new URL("/onboarding", request.url));
            }
            // User completed onboarding, allow access
            return NextResponse.next();
        }

        // User is logged in but accessing an unprotected route - allow
        return NextResponse.next();
    }

    // No session - handle unauthenticated users

    // Auth routes - allow access for non-logged-in users
    if (authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Onboarding route - require authentication
    if (pathname.startsWith("/onboarding")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Protected routes - require authentication
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Default: allow request
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};