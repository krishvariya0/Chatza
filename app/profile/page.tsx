"use client";

import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileRedirect() {
    const router = useRouter();

    useEffect(() => {
        const redirectToProfile = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();

                if (res.ok && data.user) {
                    router.replace(`/profile/${data.user.username}`);
                } else {
                    showToast.error("Please login to view your profile");
                    router.push("/auth/login");
                }
            } catch {
                showToast.error("Failed to load profile");
                router.push("/auth/login");
            }
        };

        redirectToProfile();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-primary)">
            <div className="text-(--text-muted)">Loading...</div>
        </div>
    );
}
