"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeLogo } from "@/components/layout/ThemeLogo";
import { ChatProvider, useChat } from "@/contexts/ChatContext";
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
    const { totalUnreadChats: chatUnreadCount } = useChat();
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

                        {/* Right - Updates & Chat with badges */}
                        <div className="flex items-center gap-1">
                            {/* Updates with notification badge */}
                            <Link
                                href="/updates"
                                className="p-2 hover:bg-(--bg-primary) rounded-lg transition relative"
                            >
                                <Bell size={24} className="text-(--text-primary)" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </Link>

                            {/* Chat with unread count badge */}
                            <Link
                                href="/chat"
                                className="p-2 hover:bg-(--bg-primary) rounded-lg transition relative"
                            >
                                <MessageSquare size={24} className="text-(--text-primary)" />
                                {chatUnreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-(--brand) text-white text-xs font-bold rounded-full">
                                        {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </header>
            )}

            <Sidebar
                currentUsername={user?.username}
                userFullName={user?.fullName}
                userProfilePicture={user?.profilePicture}
                notificationCount={unreadCount}
                chatUnreadCount={chatUnreadCount}
            />
            <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 lg:pb-0">{children}</main>
        </div>
    );
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <AuthGuard>
            <NotificationProvider>
                <ChatProvider>
                    <AppLayoutContent>{children}</AppLayoutContent>
                </ChatProvider>
            </NotificationProvider>
        </AuthGuard>
    );
}
