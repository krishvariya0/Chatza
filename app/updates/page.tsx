"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Bell } from "lucide-react";

export default function UpdatesPage() {
    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="text-center">
                    <Bell size={64} className="mx-auto mb-4 text-(--brand)" />
                    <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
                        Updates Page
                    </h1>
                    <p className="text-(--text-muted)">
                        Stay updated with notifications and alerts
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
