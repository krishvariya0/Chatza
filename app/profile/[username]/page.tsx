"use client";

import { FollowButton } from "@/components/FollowButton";
import { AppLayout } from "@/components/layout/AppLayout";
import { MessageButton } from "@/components/MessageButton";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { useUser } from "@/contexts/UserContext";
import { showToast } from "@/lib/toast";
import {
    ArrowLeft,
    BadgeCheck,
    Calendar,
    Globe,
    Heart,
    LogOut,
    MapPin,
    Settings,
    User as UserIcon
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
    id: string;
    username: string;
    fullName: string;
    email: string;
    profilePicture: string | null;
    bio: string;
    location: string;
    website: string;
    joinedDate: string;
    followersCount: number;
    followingCount: number;
}

interface MutualFollower {
    _id: string;
    fullName: string;
    username: string;
    profilePicture: string | null;
}

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = params.username as string;
    const { user: currentUser } = useUser();
    const fromFind = searchParams.get("from") === "find";

    const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"posts" | "likes" | "saved">("posts");
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollower, setIsFollower] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [mutualFollowers, setMutualFollowers] = useState<MutualFollower[]>([]);
    const [mutualCount, setMutualCount] = useState(0);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Logout request failed');
            }

            showToast.success('Logged out successfully!');

            // Small delay to show toast before redirect
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } catch (error) {
            console.error('Logout error:', error);
            showToast.error('Failed to logout. Please try again.');
        } finally {
            setLoggingOut(false);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser) return;

            try {
                // Fetch ALL data in parallel for maximum speed
                const isOwnProfile = username === currentUser.username;

                const promises = [
                    fetch(`/api/users/${username}`), // Profile data
                ];

                // Only fetch follow data if not own profile
                if (!isOwnProfile) {
                    promises.push(
                        fetch(`/api/users/${username}/follow-status`),
                        fetch(`/api/users/${username}/mutual-followers`)
                    );
                }

                // Execute all fetches in parallel
                const responses = await Promise.all(promises);
                const [userRes, statusRes, mutualRes] = responses;

                // Parse responses
                const userData: { success: boolean; user: UserProfile; message?: string } = await userRes.json();

                if (!userRes.ok) {
                    showToast.error(userData.message || "User not found");
                    router.push(`/profile/${currentUser.username}`);
                    return;
                }

                // Set profile data immediately
                setProfileUser(userData.user);
                setFollowersCount(userData.user.followersCount || 0);
                setFollowingCount(userData.user.followingCount || 0);

                // Parse follow status and mutual followers (if fetched)
                if (!isOwnProfile && statusRes && mutualRes) {
                    const [statusData, mutualData] = await Promise.all([
                        statusRes.json(),
                        mutualRes.json()
                    ]);

                    if (statusRes.ok && statusData.success) {
                        setIsFollowing(statusData.isFollowing);
                        setIsFollower(statusData.isFollower);
                    }

                    if (mutualRes.ok && mutualData.success) {
                        setMutualFollowers(mutualData.mutualFollowers);
                        setMutualCount(mutualData.totalCount);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                showToast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username, currentUser, router]);

    const handleFollowChange = (newIsFollowing: boolean) => {
        setIsFollowing(newIsFollowing);
        setFollowersCount(prev => newIsFollowing ? prev + 1 : prev - 1);
    };

    const isOwnProfile = currentUser?.username === username;

    return (
        <AppLayout>
            {loading ? (
                <ProfileSkeleton />
            ) : !profileUser ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-(--text-muted)">User not found</div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto w-full">
                    {/* Back Button - Only show when coming from find page */}
                    {fromFind && (
                        <div className="px-4 sm:px-6 pt-4">
                            <button
                                onClick={() => router.push("/find")}
                                className="flex items-center gap-2 text-sm sm:text-base text-(--text-primary) hover:text-(--brand) transition-colors group"
                            >
                                <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Back to Search</span>
                            </button>
                        </div>
                    )}

                    <div
                        className={`h-48 sm:h-64 relative ${fromFind ? "mt-2" : ""}`}
                        style={{
                            background:
                                "linear-gradient(135deg, #fef5e7 0%, #fce4d6 50%, #f8d7da 100%)",
                        }}
                    />

                    <div className="px-4 sm:px-6 relative">
                        {/* Profile Picture - Overlapping */}
                        <div className="flex justify-center sm:justify-start -mt-16 sm:-mt-20 mb-4 sm:mb-0">
                            <div className="relative">
                                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-(--border-color) overflow-hidden border-4 border-(--bg-card) shadow-lg flex items-center justify-center relative">
                                    {profileUser.profilePicture ? (
                                        <NextImage
                                            src={profileUser.profilePicture}
                                            alt={profileUser.fullName}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <UserIcon size={64} className="text-(--text-soft)" />
                                    )}
                                </div>
                                {isOwnProfile && (
                                    <button
                                        type="button"
                                        onClick={() => router.push("/profile/edit")}
                                        className="absolute bottom-0 right-0 w-10 h-10 bg-(--brand) rounded-full flex items-center justify-center text-white shadow-lg hover:opacity-90 transition"
                                        title="Edit Profile"
                                    >
                                        <Settings size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Card */}
                        <div className="bg-(--bg-card) rounded-3xl border border-(--border-color) shadow-xl p-6 sm:p-8 sm:pt-15">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-1">
                                <div className="text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary)">
                                            {profileUser.fullName}
                                        </h1>
                                        <BadgeCheck size={20} className="text-info shrink-0" />
                                    </div>
                                    <p className="text-base sm:text-lg text-(--text-muted) font-medium mb-4">
                                        @{profileUser.username}
                                    </p>
                                </div>
                                {profileUser.id && (
                                    <div className="flex items-center gap-2">
                                        <FollowButton
                                            targetUserId={profileUser.id}
                                            initialIsFollowing={isFollowing}
                                            initialIsFollower={isFollower}
                                            isCurrentUser={isOwnProfile}
                                            onFollowChange={handleFollowChange}
                                            size="md"
                                        />
                                        {!isOwnProfile && isFollowing && isFollower && (
                                            <MessageButton
                                                targetUserId={profileUser.id}
                                                targetUsername={profileUser.username}
                                                isMutualFollow={isFollowing && isFollower}
                                                size="md"
                                            />
                                        )}
                                        {isOwnProfile && (
                                            <button
                                                onClick={handleLogout}
                                                disabled={loggingOut}
                                                className="px-4 py-2 text-sm rounded-lg font-semibold transition-colors border-2 border-(--brand) text-(--brand) hover:bg-(--brand) hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <LogOut size={16} />
                                                {loggingOut ? 'Logging out...' : 'Logout'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {profileUser.bio && profileUser.bio.trim() !== "" ? (
                                <p className="text-(--text-primary) mb-4 leading-relaxed">
                                    {profileUser.bio}
                                </p>
                            ) : null}


                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-(--text-muted) mb-4">
                                {profileUser.location && profileUser.location.trim() !== "" && (
                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} />
                                        <span>{profileUser.location}</span>
                                    </div>
                                )}
                                {profileUser.website && profileUser.website.trim() !== "" && (
                                    <div className="flex items-center gap-1">
                                        <Globe size={16} />
                                        <a
                                            href={
                                                profileUser.website.startsWith("http")
                                                    ? profileUser.website
                                                    : `https://${profileUser.website}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-(--brand) hover:underline"
                                        >
                                            {profileUser.website}
                                        </a>
                                    </div>
                                )}
                                {profileUser.joinedDate && (
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>
                                            Joined{" "}
                                            {new Date(profileUser.joinedDate).toLocaleDateString("en-US", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
                                <div>
                                    <span className="text-xl font-bold text-(--text-primary)">0</span>
                                    <span className="text-sm text-(--text-muted) ml-1">POSTS</span>
                                </div>
                                <Link
                                    href={`/profile/${profileUser.username}/followers`}
                                    className="hover:opacity-70 transition cursor-pointer"
                                >
                                    <span className="text-xl font-bold text-(--text-primary)">{followersCount}</span>
                                    <span className="text-sm text-(--text-muted) ml-1">FOLLOWERS</span>
                                </Link>
                                <Link
                                    href={`/profile/${profileUser.username}/following`}
                                    className="hover:opacity-70 transition cursor-pointer"
                                >
                                    <span className="text-xl font-bold text-(--text-primary)">{followingCount}</span>
                                    <span className="text-sm text-(--text-muted) ml-1">FOLLOWING</span>
                                </Link>
                            </div>

                            {/* Mutual Followers Section */}
                            {!isOwnProfile && mutualFollowers.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-(--border-color)">
                                    <Link
                                        href={`/profile/${profileUser.username}/followers`}
                                        className="flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--text-primary) transition"
                                    >
                                        <div className="flex -space-x-2">
                                            {mutualFollowers.slice(0, 3).map((follower) => (
                                                <div
                                                    key={follower._id}
                                                    className="w-6 h-6 rounded-full bg-(--border-color) overflow-hidden border-2 border-(--bg-card) flex items-center justify-center"
                                                >
                                                    {follower.profilePicture ? (
                                                        <NextImage
                                                            src={follower.profilePicture}
                                                            alt={follower.fullName}
                                                            width={24}
                                                            height={24}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <UserIcon size={12} className="text-(--text-soft)" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <span>
                                            Followed by{" "}
                                            <span className="font-semibold">
                                                {mutualFollowers[0]?.username}
                                            </span>
                                            {mutualCount > 1 && (
                                                <span>
                                                    {" "}+ {mutualCount - 1} other{mutualCount > 2 ? "s" : ""} you follow
                                                </span>
                                            )}
                                        </span>
                                    </Link>
                                </div>
                            )}

                            <div className="border-t border-(--border-color) pt-6 mt-6">
                                <div className="flex gap-8 mb-6 overflow-x-auto border-b border-(--border-color) px-4 sm:px-0">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("posts")}
                                        className={`flex items-center gap-2 pb-3 px-4 border-b-2 transition whitespace-nowrap ${activeTab === "posts"
                                            ? "border-(--brand) text-(--brand)"
                                            : "border-transparent text-(--text-muted)"
                                            }`}
                                    >
                                        <span className="text-lg">📝</span>
                                        <span className="font-semibold">Posts</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("likes")}
                                        className={`flex items-center gap-2 pb-3 px-4 border-b-2 transition whitespace-nowrap ${activeTab === "likes"
                                            ? "border-(--brand) text-(--brand)"
                                            : "border-transparent text-(--text-muted)"
                                            }`}
                                    >
                                        <Heart size={18} />
                                        <span className="font-semibold">Likes</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("saved")}
                                        className={`flex items-center gap-2 pb-3 px-4 border-b-2 transition whitespace-nowrap ${activeTab === "saved"
                                            ? "border-(--brand) text-(--brand)"
                                            : "border-transparent text-(--text-muted)"
                                            }`}
                                    >
                                        <span className="text-lg">🔖</span>
                                        <span className="font-semibold">Saved</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-0">
                                    {/* <div className="col-span-2 sm:col-span-3 text-center py-12 text-(--text-muted)">
                                        No posts yet
                                    </div> */}
                                    {/* Placeholder for now - will be replaced with actual posts */}
                                    <div className="col-span-2 sm:col-span-3 text-center py-12 text-(--text-muted)">
                                        <p className="text-lg font-semibold mb-2">Posts coming soon!</p>
                                        <p className="text-sm">Your posts will appear here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
