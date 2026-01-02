"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { showToast } from "@/lib/toast";
import { Bell, User as UserIcon } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Notification {
    _id: string;
    sender: {
        _id: string;
        fullName: string;
        username: string;
        profilePicture: string | null;
    };
    type: string;
    message: string;
    isRead: boolean;
    link: string | null;
    createdAt: string;
}

export default function UpdatesPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        // Mark all as read when page loads
        markAllAsRead();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();

            if (res.ok && data.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            } else {
                showToast.error("Failed to load notifications");
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            showToast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            // Refresh the notification count in the context by triggering a re-fetch
            // The NotificationContext will pick this up on its next poll
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const notifDate = new Date(date);
        const seconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);

        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
        return notifDate.toLocaleDateString();
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto w-full px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-(--text-primary) mb-1">Updates</h1>
                    <p className="text-sm text-(--text-muted)">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-start gap-4 p-4 bg-(--bg-card) rounded-xl border border-(--border-color) animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-(--border-color)" />
                                <div className="flex-1">
                                    <div className="h-4 bg-(--border-color) rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-(--border-color) rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <Bell size={48} className="text-(--text-soft) mx-auto mb-4" />
                        <p className="text-(--text-muted) text-lg mb-2">No updates yet</p>
                        <p className="text-(--text-soft) text-sm">
                            When someone follows you or interacts with your posts, you&apos;ll see it here
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {notifications.map((notification) => (
                                <Link
                                    key={notification._id}
                                    href={notification.link || `/profile/${notification.sender.username}`}
                                    className={`
                                        flex items-start gap-4 p-4 rounded-xl border transition
                                        hover:shadow-md
                                        ${notification.isRead
                                            ? 'bg-(--bg-card) border-(--border-color)'
                                            : 'bg-accent-blue-light border-accent-blue-dark'
                                        }
                                    `}
                                >
                                    <div className="w-12 h-12 rounded-full bg-(--border-color) overflow-hidden flex items-center justify-center shrink-0">
                                        {notification.sender.profilePicture ? (
                                            <NextImage
                                                src={notification.sender.profilePicture}
                                                alt={notification.sender.fullName}
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <UserIcon size={24} className="text-brand" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-(--text-primary) text-sm">
                                            <span className="font-semibold">{notification.sender.fullName}</span>
                                            {' '}
                                            <span className="text-(--text-muted)">{notification.message}</span>
                                        </p>
                                        <p className="text-xs text-(--brand) mt-1">
                                            {getTimeAgo(notification.createdAt)}
                                        </p>
                                    </div>

                                    {notification.type === 'follow' && (
                                        <div className="shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-error-bg flex items-center justify-center">
                                                <UserIcon size={16} className="text-(--brand)" />
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Warning Message */}
                        <div className="mt-6 p-4 bg-(--bg-card) border-2 border-(--border-brand) rounded-xl shadow-sm">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-error text-lg">⚠️</span>
                                <p className="text-sm text-(--brand) font-medium text-error">
                                    Notifications are automatically deleted after 15 days
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
