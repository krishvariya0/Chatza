'use client';

import { FollowButton } from "@/components/FollowButton";
import { AppLayout } from "@/components/layout/AppLayout";
import { showToast } from "@/lib/toast";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FollowerUser {
    _id: string;
    fullName: string;
    username: string;
    profilePicture: string | null;
    isFollowing: boolean;
    isFollower: boolean;
    isCurrentUser: boolean;
    isMutual?: boolean;
}

export default function FollowersPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [followers, setFollowers] = useState<FollowerUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                // Fetch followers using username
                const followersRes = await fetch(`/api/users/${username}/followers`);
                const followersData = await followersRes.json();

                if (followersRes.ok && followersData.success) {
                    setFollowers(followersData.followers);
                } else {
                    showToast.error("Failed to load followers");
                }
            } catch (error) {
                console.error("Error fetching followers:", error);
                showToast.error("Failed to load followers");
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }, [username, router]);

    const handleFollowChange = (userId: string, isFollowing: boolean) => {
        setFollowers(prev =>
            prev.map(follower =>
                follower._id === userId
                    ? { ...follower, isFollowing }
                    : follower
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
                        <h1 className="text-2xl font-bold text-(--text-primary)">Followers</h1>
                        <p className="text-sm text-(--text-muted)">@{username}</p>
                    </div>
                </div>

                {/* Followers List */}
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
                ) : followers.length === 0 ? (
                    <div className="text-center py-12">
                        <UserIcon size={48} className="text-(--text-soft) mx-auto mb-4" />
                        <p className="text-(--text-muted)">No followers yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {followers.map((follower) => (
                            <div
                                key={follower._id}
                                className="flex items-center gap-4 p-4 bg-(--bg-card) rounded-xl border border-(--border-color) hover:shadow-md transition"
                            >
                                <Link href={`/profile/${follower.username}`}>
                                    <div className="w-12 h-12 rounded-full bg-(--border-color) overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                        {follower.profilePicture ? (
                                            <NextImage
                                                src={follower.profilePicture}
                                                alt={follower.fullName}
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <UserIcon size={24} className="text-(--text-soft)" />
                                        )}
                                    </div>
                                </Link>

                                <Link href={`/profile/${follower.username}`} className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-(--text-primary) truncate hover:underline">
                                        {follower.fullName}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-(--text-muted) truncate">
                                            @{follower.username}
                                        </p>
                                        {follower.isFollowing && follower.isFollower && (
                                            <span className="text-xs bg-(--border-color) text-(--text-soft) px-2 py-0.5 rounded-full border border-(--border-color)">
                                                Mutual
                                            </span>
                                        )}
                                    </div>
                                </Link>

                                <FollowButton
                                    targetUserId={follower._id}
                                    initialIsFollowing={follower.isFollowing}
                                    initialIsFollower={follower.isFollower}
                                    isCurrentUser={follower.isCurrentUser}
                                    onFollowChange={(isFollowing) => handleFollowChange(follower._id, isFollowing)}
                                    size="sm"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
