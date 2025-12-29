import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
    userId: string | null;
    profilePicture: string | null;
    bio: string;
    location: string;
    website: string;
    currentStep: number;
    setUserId: (id: string) => void;
    setProfilePicture: (url: string) => void;
    setBio: (bio: string) => void;
    setLocation: (location: string) => void;
    setWebsite: (website: string) => void;
    setCurrentStep: (step: number) => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            userId: null,
            profilePicture: null,
            bio: "",
            location: "",
            website: "",
            currentStep: 1,
            setUserId: (id) => set({ userId: id }),
            setProfilePicture: (url) => set({ profilePicture: url }),
            setBio: (bio) => set({ bio }),
            setLocation: (location) => set({ location }),
            setWebsite: (website) => set({ website }),
            setCurrentStep: (step) => set({ currentStep: step }),
            reset: () =>
                set({
                    userId: null,
                    profilePicture: null,
                    bio: "",
                    location: "",
                    website: "",
                    currentStep: 1,
                }),
        }),
        {
            name: "onboarding-storage",
        }
    )
);
