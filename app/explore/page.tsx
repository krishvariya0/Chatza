"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Compass } from "lucide-react";

export default function ExplorePage() {
    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="text-center">
                    <Compass size={64} className="mx-auto mb-4 text-(--brand)" />
                    <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
                        Explore Page
                    </h1>
                    <p className="text-(--text-muted)">
                        Discover trending topics and popular content
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
