"use client";

/* =========================
   Imports
========================= */
import { AppLayout } from "@/components/layout/AppLayout";
import { Heart, MessageCircle, Share2 } from "lucide-react";

/* =========================
   MAIN FEED PAGE
========================= */
export default function FeedPage() {
    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto px-4 py-10">

                {/* =========================
               FEED HEADER
            ========================= */}
                <section className="max-w-2xl mx-auto mb-8">
                    <h1 className="text-2xl font-semibold text-(--text-primary)">
                        Feed
                    </h1>
                    <p className="text-sm text-(--text-muted)">
                        Latest posts from the community
                    </p>
                    {/* Red accent line */}
                    <div className="mt-3 h-1 w-10 rounded-full bg-(--btn-bg)" />
                </section>

                {/* =========================
               POSTS LIST
            ========================= */}
                <section className="max-w-2xl mx-auto space-y-6">

                    <PostCard
                        username="krish_variya"
                        time="2 min ago"
                        content="Building Chatza step by step 🚀 Loving the progress!"
                    />

                    <PostCard
                        username="chatza_dev"
                        time="10 min ago"
                        content="Temporary feed UI is live. Backend coming soon 🔥"
                        hasImage
                    />

                    <PostCard
                        username="john_doe"
                        time="1 hour ago"
                        content="Dark mode on Chatza looks clean 👀"
                    />

                </section>

            </div>
        </AppLayout>
    );
}

/* =========================================================
   COMPONENT: PostCard
   Purpose: Temporary feed post UI
========================================================= */
function PostCard({
    username,
    time,
    content,
    hasImage = false,
}: {
    username: string;
    time: string;
    content: string;
    hasImage?: boolean;
}) {
    return (
        <article
            className="
                relative
                rounded-2xl
                border border-(--border-color)
                bg-(--card-bg)
                p-5
            "
        >
            {/* Red left accent */}
            <span className="absolute left-0 top-5 h-10 w-1 rounded-r bg-(--btn-bg)" />

            {/* =========================
               POST HEADER
            ========================= */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="font-semibold text-(--btn-bg)">
                        @{username}
                    </p>
                    <p className="text-xs text-(--text-muted)">
                        {time}
                    </p>
                </div>
            </div>

            {/* =========================
               POST CONTENT
            ========================= */}
            <p className="text-(--text-primary) mb-4">
                {content}
            </p>

            {/* =========================
               IMAGE PLACEHOLDER
            ========================= */}
            {hasImage && (
                <div
                    className="
                        mb-4
                        h-48
                        rounded-xl
                        bg-(--cta-bg)
                        flex
                        items-center
                        justify-center
                        text-sm
                        text-(--text-muted)
                        border border-dashed border-(--btn-bg)
                    "
                >
                    Image preview
                </div>
            )}

            {/* =========================
               POST ACTIONS
            ========================= */}
            <div className="flex items-center justify-between text-sm">

                <button
                    className="
                        flex items-center gap-1
                        text-(--text-muted)
                        hover:text-(--btn-bg)
                        transition
                    "
                >
                    <Heart size={16} />
                    Like
                </button>

                <button
                    className="
                        flex items-center gap-1
                        text-(--text-muted)
                        hover:text-(--btn-bg)
                        transition
                    "
                >
                    <MessageCircle size={16} />
                    Comment
                </button>

                <button
                    className="
                        flex items-center gap-1
                        text-(--text-muted)
                        hover:text-(--btn-bg)
                        transition
                    "
                >
                    <Share2 size={16} />
                    Share
                </button>

            </div>
        </article>
    );
}
