"use client";

import { showToast } from "@/lib/toast";
import { ArrowLeft, Globe, MapPin, User } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface UserProfile {
    id: string;
    username: string;
    fullName: string;
    profilePicture: string | null;
    bio: string;
    location: string;
    website: string;
}

interface ProfileFormData {
    username: string;
    fullName: string;
    profilePicture: string;
    bio: string;
    location: string;
    website: string;
}

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProfileFormData>({
        defaultValues: {
            username: "",
            fullName: "",
            profilePicture: "",
            bio: "",
            location: "",
            website: "",
        },
    });

    const profilePicture = watch("profilePicture");
    const bio = watch("bio");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/onboarding");
                const data = await res.json();

                if (res.ok) {
                    setUser(data.user);
                    setValue("username", data.user.username || "");
                    setValue("fullName", data.user.fullName || "");
                    setValue("profilePicture", data.user.profilePicture || "");
                    setValue("bio", data.user.bio || "");
                    setValue("location", data.user.location || "");
                    setValue("website", data.user.website || "");
                } else if (res.status === 401) {
                    showToast.error("Please login to continue");
                    router.push("/auth/login");
                }
            } catch {
                showToast.error("Failed to load profile");
            }
        };

        fetchUser();
    }, [router, setValue]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast.error("Image size should be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formDataUpload,
            });

            const data = await res.json();

            if (res.ok) {
                setValue("profilePicture", data.url);
                showToast.success("Profile picture uploaded!");
            } else {
                showToast.error(data.message || "Upload failed");
                setPreview(null);
            }
        } catch {
            showToast.error("Failed to upload image");
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        setLoading(true);
        try {
            const res = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (res.ok) {
                showToast.success("Profile updated successfully!");
                router.push(`/profile/${responseData.user.username}`);
            } else if (res.status === 401) {
                showToast.error("Please login to continue");
                router.push("/auth/login");
            } else {
                showToast.error(responseData.message || "Failed to update profile");
            }
        } catch {
            showToast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-(--text-muted)">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-(--text-muted) hover:text-(--text-primary) transition mb-6"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back</span>
                </button>

                <div className="bg-(--bg-card) rounded-3xl border border-(--border-color) shadow-xl p-6 sm:p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-2">
                            Edit Profile
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-(--text-muted)">
                            <span className="font-semibold text-(--text-primary)">{user.fullName}</span>
                            <span>·</span>
                            <span>@{user.username}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-(--text-muted) mb-3">
                                Profile Picture
                            </label>
                            <div className="flex items-center gap-4">
                                <div
                                    className="relative w-24 h-24 rounded-full bg-(--border-color) overflow-hidden cursor-pointer hover:opacity-80 transition flex items-center justify-center"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {preview || profilePicture ? (
                                        <NextImage
                                            src={preview || profilePicture}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User size={48} className="text-(--text-soft)" />
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="px-4 py-2 rounded-lg border border-(--border-color) text-sm font-medium text-(--text-primary) hover:bg-(--bg-primary) transition disabled:opacity-50"
                                >
                                    {uploading ? "Uploading..." : "Change Photo"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-(--text-muted) mb-2">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)">
                                    @
                                </span>
                                <input
                                    type="text"
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: {
                                            value: 3,
                                            message: "Username must be at least 3 characters",
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: "Username must be less than 30 characters",
                                        },
                                        pattern: {
                                            value: /^[a-z0-9_]+$/,
                                            message: "Username can only contain lowercase letters, numbers, and underscores",
                                        },
                                        onChange: (e) => {
                                            e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                                        },
                                    })}
                                    placeholder="username"
                                    className={`w-full pl-8 pr-4 py-3 rounded-xl bg-transparent border text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--brand) ${errors.username ? "border-red-500" : "border-(--border-color)"
                                        }`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                            )}
                            {!errors.username && (
                                <div className="text-xs text-(--text-soft) mt-1">
                                    Only lowercase letters, numbers, and underscores
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-(--text-muted) mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("fullName", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Full name must be at least 2 characters",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Full name must be less than 50 characters",
                                    },
                                })}
                                placeholder="John Doe"
                                className={`w-full px-4 py-3 rounded-xl bg-transparent border text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--brand) ${errors.fullName ? "border-red-500" : "border-(--border-color)"
                                    }`}
                            />
                            {errors.fullName && (
                                <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-(--text-muted) mb-2">
                                Bio
                            </label>
                            <textarea
                                {...register("bio", {
                                    maxLength: {
                                        value: 160,
                                        message: "Bio must be less than 160 characters",
                                    },
                                })}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                className={`w-full px-4 py-3 rounded-xl bg-transparent border text-(--text-primary) resize-none focus:outline-none focus:ring-2 focus:ring-(--brand) ${errors.bio ? "border-red-500" : "border-(--border-color)"
                                    }`}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.bio && (
                                    <p className="text-xs text-red-500">{errors.bio.message}</p>
                                )}
                                <div className={`text-xs ml-auto ${bio.length > 160 ? "text-red-500" : "text-(--text-soft)"}`}>
                                    {bio.length}/160
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-(--text-muted) mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    {...register("location", {
                                        maxLength: {
                                            value: 100,
                                            message: "Location must be less than 100 characters",
                                        },
                                    })}
                                    placeholder="San Francisco, CA"
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--brand) ${errors.location ? "border-red-500" : "border-(--border-color)"
                                        }`}
                                />
                            </div>
                            {errors.location && (
                                <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-(--text-muted) mb-2">
                                Website
                            </label>
                            <div className="relative">
                                <Globe
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-soft)"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    {...register("website", {
                                        pattern: {
                                            value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                                            message: "Please enter a valid website URL",
                                        },
                                    })}
                                    placeholder="yourwebsite.com"
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--brand) ${errors.website ? "border-red-500" : "border-(--border-color)"
                                        }`}
                                />
                            </div>
                            {errors.website && (
                                <p className="text-xs text-red-500 mt-1">{errors.website.message}</p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="flex-1 bg-(--brand) text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-90 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                disabled={loading}
                                className="px-6 py-3 rounded-xl border border-(--border-color) text-(--text-primary) font-medium hover:bg-(--bg-primary) transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
