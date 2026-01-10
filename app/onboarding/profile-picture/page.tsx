"use client";

import { useOnboardingStore } from "@/app/onboarding/store/onboardingStore";
import { showToast } from "@/lib/toast";
import { User } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProfilePicturePage() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { profilePicture, setProfilePicture } = useOnboardingStore();

    // Clear preview if profilePicture is null (new user)
    useEffect(() => {
        if (!profilePicture) {
            setPreview(null);
        }
    }, [profilePicture]);

    const compressImage = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set canvas size to 500x500 (server will crop to this anyway)
                    const MAX_SIZE = 500;
                    canvas.width = MAX_SIZE;
                    canvas.height = MAX_SIZE;

                    // Calculate dimensions to cover the square
                    let srcX, srcY, srcWidth, srcHeight;
                    const aspectRatio = img.width / img.height;

                    if (aspectRatio > 1) {
                        // Landscape
                        srcHeight = img.height;
                        srcWidth = img.height;
                        srcX = (img.width - img.height) / 2;
                        srcY = 0;
                    } else {
                        // Portrait or square
                        srcWidth = img.width;
                        srcHeight = img.width;
                        srcX = 0;
                        srcY = (img.height - img.width) / 2;
                    }

                    // Draw the image
                    ctx?.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, MAX_SIZE, MAX_SIZE);

                    // Convert to blob with 0.8 quality
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Failed to compress image'));
                            }
                        },
                        'image/jpeg',
                        0.8 // 80% quality - good balance of quality and size
                    );
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

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

        // Show preview immediately for better UX
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            // Compress image on client-side BEFORE upload
            const compressedBlob = await compressImage(file);

            const formData = new FormData();
            formData.append("file", compressedBlob, "profile.jpg");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                showToast.error(data.message || "Upload failed");
                setPreview(null);
                return;
            }

            setProfilePicture(data.url);
            showToast.success("Profile picture uploaded!");
        } catch (error) {
            console.error('Upload error:', error);
            showToast.error("Failed to upload image");
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleContinue = () => {
        router.push("/onboarding/bio");
    };

    const handleSkip = () => {
        router.push("/onboarding/bio");
    };

    return (
        <div className="w-full max-w-125">
            <div className="rounded-3xl bg-(--bg-card) border border-(--border-color) shadow-xl px-8 py-10">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-(--text-muted)">
                            Step 1 of 4
                        </span>
                        <span className="text-sm font-semibold text-(--brand)">25%</span>
                    </div>
                    <div className="w-full h-2 bg-(--border-color) rounded-full overflow-hidden">
                        <div
                            className="h-full bg-(--brand) transition-all duration-300"
                            style={{ width: "25%" }}
                        />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-(--text-primary) mb-3">
                        Add a profile picture
                    </h1>
                    <p className="text-(--text-muted)">
                        Help people recognize you on Chatza
                    </p>
                </div>

                <div className="flex flex-col items-center mb-8">
                    <div
                        className="relative w-40 h-40 rounded-full bg-(--border-color) flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {preview || profilePicture ? (
                            <NextImage
                                src={preview || profilePicture || ""}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <User size={64} className="text-(--text-soft)" />
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
                        className="mt-6 text-(--brand) font-semibold hover:underline"
                    >
                        {uploading ? "Uploading..." : "Choose Image"}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={uploading}
                    className="w-full bg-(--brand) text-white font-semibold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-98 transition mb-4"
                >
                    Continue
                </button>

                <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full text-(--text-muted) font-medium py-3 hover:text-(--text-primary) transition"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}
