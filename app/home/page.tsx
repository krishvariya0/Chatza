"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useUser } from "@/contexts/UserContext";
import { Home as HomeIcon } from "lucide-react";

export default function HomePage() {
    const { user } = useUser();

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="text-center">
                    <HomeIcon size={64} className="mx-auto mb-4 text-(--brand)" />
                    <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
                        Home Page
                    </h1>
                    <p className="text-(--text-muted)">
                        Welcome to your home feed, {user?.fullName}!
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
