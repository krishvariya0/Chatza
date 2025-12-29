"use client";

import { useOnboardingStore } from "@/app/onboarding/store/onboardingStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
    const router = useRouter();
    const { reset } = useOnboardingStore();

    useEffect(() => {
        // Reset store for new onboarding session
        reset();
        router.push("/onboarding/profile-picture");
    }, [router, reset]);

    return null;
}
