"use client";

import { useOnboardingStore } from "@/app/onboarding/store/onboardingStore";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LocationPage() {
    const router = useRouter();
    const { location, setLocation } = useOnboardingStore();
    const [localLocation, setLocalLocation] = useState(location);

    const handleContinue = () => {
        setLocation(localLocation);
        router.push("/onboarding/preview");
    };

    const handleSkip = () => {
        router.push("/onboarding/preview");
    };

    return (
        <div className="w-full max-w-125">
            <div className="rounded-3xl bg-(--bg-card) border border-(--border-color) shadow-xl px-8 py-10">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-(--text-muted)">
                            Step 3 of 4
                        </span>
                        <span className="text-sm font-semibold text-(--brand)">75%</span>
                    </div>
                    <div className="w-full h-2 bg-(--border-color) rounded-full overflow-hidden">
                        <div
                            className="h-full bg-(--brand) transition-all duration-300"
                            style={{ width: "75%" }}
                        />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-(--text-primary) mb-3">
                        Where are you from?
                    </h1>
                    <p className="text-(--text-muted)">Let others know your location</p>
                </div>

                <div className="mb-8">
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
                            value={localLocation}
                            onChange={(e) => setLocalLocation(e.target.value)}
                            placeholder="San Francisco, CA"
                            className="w-full pl-11 pr-4 py-4 rounded-xl bg-transparent border border-(--border-color) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--brand)"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleContinue}
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
