"use client";

import { useUser } from "@/contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (!loading && !user && !hasRedirected.current) {
            hasRedirected.current = true;
            const currentPath = pathname || window.location.pathname;
            router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
        }
    }, [loading, user, router, pathname]);

    // Show minimal loading only on initial load
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-(--brand) border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Don't render anything while redirecting
    if (!user) {
        return null;
    }

    return <>{children}</>;
}