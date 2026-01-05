'use client';

import { FollowButton } from "@/components/FollowButton";
import { AppLayout } from "@/components/layout/AppLayout";
import { MessageButton } from "@/components/MessageButton";
import { showToast } from "@/lib/toast";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FollowingUser {
    _id: string;
    fullName: string;
    username: string;
    profilePicture: string | null;
    isFollowing: boolean;
    isFollower: boolean;
    isCurrentUser: boolean;
    isMutual?: boolean;
}

export default function FollowingPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [following, setFollowing] = useState<FollowingUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                // Fetch following using username
                const followingRes = await fetch(`/api/users/${username}/following`);
                const followingData = await followingRes.json();

                if (followingRes.ok && followingData.success) {
                    setFollowing(followingData.following);
                } else {
                    showToast.error("Failed to load following");
                }
            } catch (error) {
                console.error("Error fetching following:", error);
                showToast.error("Failed to load following");
            } finally {
                setLoading(false);
            }
        };

        fetchFollowing();
    }, [username, router]);

    const handleFollowChange = (userId: string, isFollowing: boolean) => {
        setFollowing(prev =>
            prev.map(user =>
                user._id === userId
                    ? { ...user, isFollowing }
                    : user
            )
        );
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto w-full px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-(--bg-primary) rounded-lg transition"
                    >
                        <ArrowLeft size={24} className="text-(--text-primary)" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-(--text-primary)">Following</h1>
                        <p className="text-sm text-(--text-muted)">@{username}</p>
                    </div>
                </div>

                {/* Following List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-(--bg-card) rounded-xl border border-(--border-color) animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-(--border-color)" />
                                <div className="flex-1">
                                    <div className="h-4 bg-(--border-color) rounded w-32 mb-2" />
                                    <div className="h-3 bg-(--border-color) rounded w-24" />
                                </div>
                                <div className="h-9 w-24 bg-(--border-color) rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : following.length === 0 ? (
                    <div className="text-center py-12">
                        <UserIcon size={48} className="text-(--text-soft) mx-auto mb-4" />
                        <p className="text-(--text-muted)">Not following anyone yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {following.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center gap-4 p-4 bg-(--bg-card) rounded-xl border border-(--border-color) hover:shadow-md transition"
                            >
                                <Link href={`/profile/${user.username}`}>
                                    <div className="w-12 h-12 rounded-full bg-(--border-color) overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                        {user.profilePicture ? (
                                            <NextImage
                                                src={user.profilePicture}
                                                alt={user.fullName}
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <UserIcon size={24} className="text-(--text-soft)" />
                                        )}
                                    </div>
                                </Link>

                                <Link href={`/profile/${user.username}`} className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-(--text-primary) truncate hover:underline">
                                        {user.fullName}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-(--text-muted) truncate">
                                            @{user.username}
                                        </p>
                                        {user.isFollowing && user.isFollower && (
                                            <span className="text-xs bg-(--border-color) text-(--text-soft) px-2 py-0.5 rounded-full border border-(--border-color)">
                                                Mutual
                                            </span>
                                        )}
                                    </div>
                                </Link>

                                <div className="flex items-center gap-2">
                                    <FollowButton
                                        targetUserId={user._id}
                                        initialIsFollowing={user.isFollowing}
                                        initialIsFollower={user.isFollower}
                                        isCurrentUser={user.isCurrentUser}
                                        onFollowChange={(isFollowing) => handleFollowChange(user._id, isFollowing)}
                                        size="sm"
                                    />
                                    {!user.isCurrentUser && user.isFollowing && user.isFollower && (
                                        <MessageButton
                                            targetUserId={user._id}
                                            targetUsername={user.username}
                                            isMutualFollow={user.isFollowing && user.isFollower}
                                            size="sm"
                                            showText={false}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
