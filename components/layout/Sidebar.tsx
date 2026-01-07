"use client";

import { ThemeLogo } from "@/components/layout/ThemeLogo";
import { useUser } from "@/contexts/UserContext";
import {
    ArrowLeftRight,
    Bell,
    Compass,
    Film,
    Home,
    LogOut,
    MessageSquare,
    PlusCircle,
    Search,
    User as UserIcon
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    currentUsername?: string;
    userFullName?: string;
    userProfilePicture?: string | null;
    notificationCount?: number;
    chatUnreadCount?: number;
}

export function Sidebar({ currentUsername, userFullName, userProfilePicture, notificationCount = 0, chatUnreadCount = 0 }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useUser();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const navItems = [
        { href: "/home", icon: Home, label: "Home" },
        { href: "/find", icon: Search, label: "Find" },
        { href: "/explore", icon: Compass, label: "Explore" },
        { href: "/feed", icon: Film, label: "Feed" },
    ];

    return (
        <>
            {/* Desktop Sidebar - Left side on large screens */}
            <aside className="hidden lg:flex lg:flex-col w-64 border-r border-(--border-color) bg-(--bg-card) sticky top-0 h-screen">
                <div className="flex flex-col h-full p-4">
                    {/* Logo */}
                    <div className="mb-8 px-2">
                        <Link href="/home" className="flex items-center gap-3">
                            <ThemeLogo className="h-10 w-auto" />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1 mb-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active
                                        ? "bg-(--brand) text-white"
                                        : "text-(--text-primary) hover:bg-(--bg-primary)"
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Chat Button with unread badge */}
                    <Link
                        href="/chat"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-4 transition relative ${isActive("/chat")
                            ? "bg-(--brand) text-white"
                            : "text-(--text-primary) hover:bg-(--bg-primary)"
                            }`}
                    >
                        <MessageSquare size={20} />
                        <span className="font-medium">Chat</span>
                        {chatUnreadCount > 0 && (
                            <span className="ml-auto min-w-[24px] h-6 px-2 flex items-center justify-center bg-(--brand) text-white text-xs font-bold rounded-full">
                                {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                            </span>
                        )}
                    </Link>

                    {/* Additional Nav Items */}
                    <nav className="space-y-1 mb-auto">
                        {/* Updates with notification badge */}
                        <Link
                            href="/updates"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition relative ${isActive("/updates")
                                ? "bg-(--brand) text-white"
                                : "text-(--text-primary) hover:bg-(--bg-primary)"
                                }`}
                        >
                            <Bell size={20} />
                            <span className="font-medium">Updates</span>
                            {notificationCount > 0 && (
                                <span className="ml-auto min-w-[24px] h-6 px-2 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                                    {notificationCount > 99 ? '99+' : notificationCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/create"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive("/create")
                                ? "bg-(--brand) text-white"
                                : "text-(--text-primary) hover:bg-(--bg-primary)"
                                }`}
                        >
                            <PlusCircle size={20} />
                            <span className="font-medium">Make</span>
                        </Link>
                    </nav>

                    {/* Profile Section at Bottom */}
                    {currentUsername && (
                        <div className="mt-auto pt-4 border-t border-(--border-color)">
                            <div className="flex items-center justify-between gap-3 px-2 py-2 mb-2">
                                <Link
                                    href={`/profile/${currentUsername}`}
                                    className="flex items-center gap-3 flex-1 min-w-0"
                                >
                                    <div className="w-10 h-10 rounded-full bg-(--border-color) overflow-hidden flex items-center justify-center relative shrink-0">
                                        {userProfilePicture ? (
                                            <NextImage
                                                src={userProfilePicture}
                                                alt={userFullName || currentUsername}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <UserIcon size={20} className="text-(--text-soft)" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-(--text-primary) truncate">
                                            {userFullName || currentUsername}
                                        </p>
                                        <p className="text-xs text-(--text-muted) truncate">
                                            @{currentUsername}
                                        </p>
                                    </div>
                                </Link>
                                <Link
                                    href="#"
                                    className="p-2 hover:bg-(--bg-primary) rounded-lg transition shrink-0"
                                    title="Settings"
                                >
                                    <ArrowLeftRight size={18} className="text-(--text-muted)" />
                                </Link>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-(--text-muted) hover:bg-(--bg-primary) hover:text-red-500 transition"
                            >
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-(--bg-card) border-t border-(--border-color) z-50 pb-safe">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition min-w-15 ${active
                                    ? "text-(--brand)"
                                    : "text-(--text-muted)"
                                    }`}
                            >
                                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                    {currentUsername && (
                        <Link
                            href={`/profile/${currentUsername}`}
                            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition min-w-15 ${pathname?.includes(`/profile/${currentUsername}`)
                                ? "text-(--brand)"
                                : "text-(--text-muted)"
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full overflow-hidden flex items-center justify-center relative ${pathname?.includes(`/profile/${currentUsername}`)
                                ? "ring-2 ring-(--brand)"
                                : ""
                                }`}>
                                {userProfilePicture ? (
                                    <NextImage
                                        src={userProfilePicture}
                                        alt={userFullName || currentUsername}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-(--border-color) flex items-center justify-center">
                                        <UserIcon size={16} />
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] font-medium">Profile</span>
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
}
