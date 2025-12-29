"use client";

/* =========================
   Imports
========================= */
import { Hash, Heart, Home, MessageCircle, PenSquare, Share2, Shield, Star, TrendingUp, User } from "lucide-react";
import Link from "next/link";

/* =========================
   MAIN FEED PAGE
========================= */
export default function FeedPage() {
    return (
        <div className="min-h-screen bg-(--bg-primary) flex">
            {/* Left Sidebar */}
            <aside className="hidden lg:block w-64 border-r border-(--border-color) p-6 sticky top-0 h-screen overflow-y-auto">
                <div className="mb-8">
                    <Link href="/feed" className="flex items-center gap-2 text-2xl font-bold text-(--brand)">
                        <div className="w-8 h-8 bg-(--brand) rounded-lg flex items-center justify-center text-white">
                            C
                        </div>
                        Chatza
                    </Link>
                </div>

                <nav className="space-y-2 mb-8">
                    <Link
                        href="/feed"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-(--bg-card) text-(--brand) transition"
                    >
                        <Home size={20} />
                        <span className="font-medium">Feed</span>
                    </Link>
                    <Link
                        href="/top"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-(--text-muted) hover:bg-(--bg-card) transition"
                    >
                        <TrendingUp size={20} />
                        <span className="font-medium">Top</span>
                    </Link>
                    <Link
                        href="/auth"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-(--text-muted) hover:bg-(--bg-card) transition"
                    >
                        <Shield size={20} />
                        <span className="font-medium">Auth</span>
                    </Link>
                    <Link
                        href="/teed"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-(--text-muted) hover:bg-(--bg-card) transition"
                    >
                        <Hash size={20} />
                        <span className="font-medium">Teed</span>
                    </Link>
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-(--text-muted) hover:bg-(--bg-card) transition"
                    >
                        <User size={20} />
                        <span className="font-medium">Profile</span>
                    </Link>
                </nav>

                <div className="mb-8">
                    <h3 className="text-xs font-semibold text-(--text-muted) uppercase mb-3 px-4">
                        FAVORITES
                    </h3>
                    <div className="space-y-2">
                        <Link
                            href="/favorites/design"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-(--text-muted) hover:bg-(--bg-card) transition"
                        >
                            <Star size={16} className="text-yellow-500" />
                            <span className="text-sm">Design Inspiration</span>
                        </Link>
                        <Link
                            href="/favorites/tech"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-(--text-muted) hover:bg-(--bg-card) transition"
                        >
                            <Star size={16} className="text-blue-500" />
                            <span className="text-sm">Tech News</span>
                        </Link>
                        <Link
                            href="/favorites/art"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-(--text-muted) hover:bg-(--bg-card) transition"
                        >
                            <Star size={16} className="text-purple-500" />
                            <span className="text-sm">Digital Art</span>
                        </Link>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full bg-(--brand) text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                    <PenSquare size={20} />
                    Create Post
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-2xl mx-auto px-4 py-10">

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

            </main>
        </div >
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
