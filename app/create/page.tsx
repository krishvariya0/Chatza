"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PlusCircle } from "lucide-react";

export default function CreatePage() {
    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="text-center">
                    <PlusCircle size={64} className="mx-auto mb-4 text-(--brand)" />
                    <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
                        Make/Create Page
                    </h1>
                    <p className="text-(--text-muted)">
                        Create new posts, stories, and content
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
