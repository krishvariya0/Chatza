"use client";

import { useOnboardingStore } from "@/app/onboarding/store/onboardingStore";
import { useUser } from "@/contexts/UserContext";
import { showToast } from "@/lib/toast";
import { Globe, MapPin, User } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PreviewPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Get user data from UserContext (already loaded, no API call needed)
    const { user } = useUser();

    const { profilePicture, bio, location, website, reset } =
        useOnboardingStore();

    const handleComplete = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profilePicture,
                    bio,
                    location,
                    website,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    showToast.error("Please login to continue");
                    router.push("/auth/login");
                    return;
                }
                showToast.error(data.message || "Failed to complete onboarding");
                return;
            }

            showToast.success("Profile created successfully! 🎉");
            reset();

            // Immediately redirect to profile page (no delay for faster UX)
            // Use window.location.replace to prevent back button issues
            window.location.replace(`/profile/${data.user.username}`);
        } catch {
            showToast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        router.push("/onboarding/profile-picture");
    };

    return (
        <div className="w-full max-w-125">
            <div className="rounded-3xl bg-(--bg-card) border border-(--border-color) shadow-xl px-8 py-10">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-(--text-muted)">
                            Step 4 of 4
                        </span>
                        <span className="text-sm font-semibold text-(--brand)">100%</span>
                    </div>
                    <div className="w-full h-2 bg-(--border-color) rounded-full overflow-hidden">
                        <div
                            className="h-full bg-(--brand) transition-all duration-300"
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-(--text-primary) mb-3">
                        Preview your profile
                    </h1>
                    <p className="text-(--text-muted)">This is how others will see you</p>
                </div>

                <div className="mb-8 p-6 rounded-2xl border border-(--border-color) bg-(--bg-primary)">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-(--border-color) overflow-hidden mb-4 flex items-center justify-center relative">
                            {profilePicture ? (
                                <NextImage
                                    src={profilePicture}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User size={48} className="text-(--text-soft)" />
                            )}
                        </div>

                        {user && (
                            <>
                                <h2 className="text-xl font-bold text-(--text-primary) mb-1">
                                    {user.fullName}
                                </h2>
                                <p className="text-sm text-(--text-muted) mb-4">
                                    @{user.username}
                                </p>
                            </>
                        )}

                        {bio && (
                            <p className="text-sm text-(--text-primary) mb-4 max-w-md">
                                {bio}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-4 justify-center text-sm text-(--text-muted)">
                            {location && (
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} />
                                    <span>{location}</span>
                                </div>
                            )}
                            {website && (
                                <div className="flex items-center gap-1">
                                    <Globe size={16} />
                                    <span className="text-(--brand)">{website}</span>
                                </div>
                            )}
                        </div>

                        {!bio && !location && !website && (
                            <p className="text-sm text-(--text-soft) italic mt-4">
                                No additional information added
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleComplete}
                    disabled={loading}
                    className="w-full bg-(--brand) text-white font-semibold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-98 transition mb-4"
                >
                    {loading ? "Creating profile..." : "Complete Setup"}
                </button>

                <button
                    type="button"
                    onClick={handleEdit}
                    className="w-full text-(--text-muted) font-medium py-3 hover:text-(--text-primary) transition"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
}
