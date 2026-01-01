"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeLogo } from "@/components/layout/ThemeLogo";
import { useUser } from "@/contexts/UserContext";
import { Bell, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { user } = useUser();
    const pathname = usePathname();

    // Check if we're on the home page
    const isHomePage = pathname === '/home';

    return (
        <AuthGuard>
            <div className="min-h-screen bg-(--bg-primary) flex flex-col lg:flex-row">
                {/* Mobile Header - Only visible on home page and small screens */}
                {isHomePage && (
                    <header className="lg:hidden sticky top-0 z-40 bg-(--bg-card) border-b border-(--border-color) px-4 py-3">
                        <div className="flex items-center justify-between">
                            {/* Left - Create/Make Button */}
                            <Link
                                href="/create"
                                className="p-2 hover:bg-(--bg-primary) rounded-lg transition"
                            >
                                <PlusCircle size={24} className="text-(--text-primary)" />
                            </Link>

                            {/* Center - Logo */}
                            <Link href="/home" className="flex-1 flex justify-center">
                                <ThemeLogo className="h-10 w-auto" />
                            </Link>

                            {/* Right - Notifications */}
                            <Link
                                href="/updates"
                                className="p-2 hover:bg-(--bg-primary) rounded-lg transition relative"
                            >
                                <Bell size={24} className="text-(--text-primary)" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </Link>
                        </div>
                    </header>
                )}

                <Sidebar
                    currentUsername={user?.username}
                    userFullName={user?.fullName}
                    userProfilePicture={user?.profilePicture}
                />
                <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
            </div>
        </AuthGuard>
    );
}
