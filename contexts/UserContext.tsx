"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface UserProfile {
    username: string;
    fullName: string;
    profilePicture: string | null;
}

interface UserContextType {
    user: UserProfile | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me", {
                credentials: "include",
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache"
                }
            });
            if (!res.ok) {
                setUser(null);
                return;
            }
            const data = await res.json();
            setUser(data.user);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const refreshUser = useCallback(async () => {
        setLoading(true);
        setUser(null);
        await fetchUser();
    }, [fetchUser]);

    const logout = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Logout failed");
            }

            setUser(null);

            // Import dynamically to avoid SSR issues
            const { showToast } = await import("@/lib/toast");
            showToast.success("Logged out successfully!");

            // Full page reload to landing page
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } catch (error) {
            console.error("Error logging out:", error);

            // Still clear user data even if API fails
            setUser(null);

            // Import dynamically to avoid SSR issues
            const { showToast } = await import("@/lib/toast");
            showToast.error("Logout failed. Please try again.");

            // Redirect anyway after a short delay
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, refreshUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}