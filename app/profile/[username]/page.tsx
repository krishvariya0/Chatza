"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSkeleton } from "@/components/skeleton/ProfileSkeleton";
import { useUser } from "@/contexts/UserContext";
import { showToast } from "@/lib/toast";
import {
    ArrowLeft,
    BadgeCheck,
    Calendar,
    Globe,
    Heart,
    MapPin,
    Settings,
    User as UserIcon
} from "lucide-react";
import NextImage from "next/image";
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

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser) return;

            // Always fetch full profile data from API
            try {
                const userRes = await fetch(`/api/users/${username}`);
                const userData = await userRes.json();

                if (!userRes.ok) {
                    showToast.error(userData.message || "User not found");
                    router.push(`/profile/${currentUser.username}`);
                    return;
                }

                console.log("Profile data received:", userData.user);
                setProfileUser(userData.user);
            } catch (error) {
                console.error("Error fetching profile:", error);
                showToast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username, currentUser, router]);

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
                                        <BadgeCheck size={20} className="text-blue-500 shrink-0" />
                                    </div>
                                    <p className="text-base sm:text-lg text-(--text-muted) font-medium mb-4">
                                        @{profileUser.username}
                                    </p>
                                </div>
                                {isOwnProfile && (
                                    <button
                                        type="button"
                                        onClick={() => router.push("/profile/edit")}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-(--border-color) text-sm font-medium text-(--text-primary) hover:bg-(--bg-primary) transition shrink-0 mx-auto sm:mx-0"
                                    >
                                        <Settings size={16} />
                                        Edit Profile
                                    </button>
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
                                    <span className="text-xl font-bold text-(--text-primary)">142</span>
                                    <span className="text-sm text-(--text-muted) ml-1">POSTS</span>
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-(--text-primary)">12.5k</span>
                                    <span className="text-sm text-(--text-muted) ml-1">FOLLOWERS</span>
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-(--text-primary)">450</span>
                                    <span className="text-sm text-(--text-muted) ml-1">FOLLOWING</span>
                                </div>
                            </div>

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
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                        <div
                                            key={i}
                                            className="aspect-square rounded-xl bg-(--border-color) hover:opacity-80 transition cursor-pointer overflow-hidden relative"
                                        >
                                            <NextImage
                                                src={`https://picsum.photos/400/400?random=${i}`}
                                                alt={`Post ${i}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
