"use client";

import { useOnboardingStore } from "@/app/onboarding/store/onboardingStore";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BioPage() {
    const router = useRouter();
    const { bio, setBio, website, setWebsite } = useOnboardingStore();
    const [localBio, setLocalBio] = useState(bio);
    const [localWebsite, setLocalWebsite] = useState(website);

    const handleContinue = () => {
        if (localBio.length > 160) {
            showToast.error("Bio must be 160 characters or less");
            return;
        }
        setBio(localBio);
        setWebsite(localWebsite);
        router.push("/onboarding/location");
    };

    const handleSkip = () => {
        router.push("/onboarding/location");
    };

    return (
        <div className="w-full max-w-[500px]">
            <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl px-8 py-10">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-[var(--text-muted)]">
                            Step 2 of 4
                        </span>
                        <span className="text-sm font-semibold text-[var(--brand)]">
                            50%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--brand)] transition-all duration-300"
                            style={{ width: "50%" }}
                        />
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
                        Tell us about yourself
                    </h1>
                    <p className="text-[var(--text-muted)]">
                        Share a bit about who you are
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6 mb-8">
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-muted)] mb-2">
                            Bio
                        </label>
                        <textarea
                            value={localBio}
                            onChange={(e) => setLocalBio(e.target.value)}
                            placeholder="Digital Designer & Art Director based in San Francisco. Creating visual stories and crafting pixels. Coffee enthusiast ☕ and amateur photographer 📸"
                            maxLength={160}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                        />
                        <div className="text-right text-xs text-[var(--text-soft)] mt-1">
                            {localBio.length}/160
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-muted)] mb-2">
                            Website (Optional)
                        </label>
                        <input
                            type="url"
                            value={localWebsite}
                            onChange={(e) => setLocalWebsite(e.target.value)}
                            placeholder="elenadesign.com"
                            className="w-full px-4 py-3 rounded-xl bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <button
                    onClick={handleContinue}
                    className="w-full bg-[var(--brand)] text-white font-semibold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition mb-4"
                >
                    Continue
                </button>

                <button
                    onClick={handleSkip}
                    className="w-full text-[var(--text-muted)] font-medium py-3 hover:text-[var(--text-primary)] transition"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}
