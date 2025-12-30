"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="text-center">
                    <MessageSquare size={64} className="mx-auto mb-4 text-(--brand)" />
                    <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
                        Chat Page
                    </h1>
                    <p className="text-(--text-muted)">
                        Your messages and conversations (8 unread)
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
