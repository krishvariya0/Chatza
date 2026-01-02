"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeLogo } from "@/components/layout/ThemeLogo";
import { NotificationProvider, useNotifications } from "@/contexts/NotificationContext";
import { useUser } from "@/contexts/UserContext";
import { Bell, MessageSquare, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
    children: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
    const { user } = useUser();
    const { unreadCount } = useNotifications();
    const pathname = usePathname();

    // Check if we're on the home page
    const isHomePage = pathname === '/home';

    return (
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

                        {/* Right - Notifications & Chat */}
                        <div className="flex items-center gap-1">
                            <Link
                                href="/updates"
                                className="p-2 hover:bg-(--bg-primary) rounded-lg transition relative"
                            >
                                <Bell size={24} className="text-(--text-primary)" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-(--brand) rounded-full"></span>
                                )}
                            </Link>

                            <Link
                                href="/chat"
                                className="p-2 hover:bg-(--bg-primary) rounded-lg transition"
                            >
                                <MessageSquare size={24} className="text-(--text-primary)" />
                            </Link>
                        </div>
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
    );
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <AuthGuard>
            <NotificationProvider>
                <AppLayoutContent>{children}</AppLayoutContent>
            </NotificationProvider>
        </AuthGuard>
    );
}
