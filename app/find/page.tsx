"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Search } from "lucide-react";

export default function FindPage() {
    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="text-center">
                    <Search size={64} className="mx-auto mb-4 text-(--brand)" />
                    <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
                        Find Page
                    </h1>
                    <p className="text-(--text-muted)">
                        Search and discover new content and people
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
