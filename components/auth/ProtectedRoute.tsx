"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    requireAuth = true,
    redirectTo = "/auth/login",
}: ProtectedRouteProps) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (requireAuth && !user) {
                router.push(redirectTo);
            }
        }
    }, [loading, user, requireAuth, redirectTo, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-(--bg-primary)">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-(--brand) border-t-transparent rounded-full animate-spin" />
                    <p className="text-(--text-muted)">Loading...</p>
                </div>
            </div>
        );
    }

    if (requireAuth && !user) {
        return null;
    }

    return <>{children}</>;
}
