"use client";

import NextImage from "next/image";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Chat {
    _id: string;
    participants: Array<{
        _id: string;
        username: string;
        fullName: string;
        profilePicture?: string;
    }>;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount?: number;
}

interface ChatListProps {
    socket: Socket | null;
    searchQuery: string;
    selectedChatId?: string;
    onSelectChat: (chat: {
        id: string;
        name: string;
        username: string;
        avatar?: string;
        isOnline?: boolean;
    }) => void;
}

export default function ChatList({
    socket,
    searchQuery,
    selectedChatId,
    onSelectChat,
}: ChatListProps) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string>("");

    // Fetch chats via REST API
    useEffect(() => {
        // Cleanup duplicates first, then fetch
        const init = async () => {
            try {
                await fetch("/api/chats/cleanup", { method: "POST" });
            } catch {
                // Ignore cleanup errors
            }
            fetchChats();
        };
        init();
    }, []);

    // Listen for socket updates if available
    useEffect(() => {
        if (!socket?.connected) return;

        const handleNewMessage = () => {
            fetchChats();
        };

        socket.on("receive_message", handleNewMessage);

        return () => {
            socket.off("receive_message", handleNewMessage);
        };
    }, [socket]);

    const fetchChats = async () => {
        try {
            // First get current user
            const meRes = await fetch("/api/auth/me");
            const meData = await meRes.json();
            if (meRes.ok && meData.user) {
                setCurrentUserId(meData.user.id);
            }

            // Then get chats
            const res = await fetch("/api/chats");
            const data = await res.json();

            if (res.ok && data.success) {
                // Deduplicate chats by other user ID
                const uniqueChats = (data.chats || []).reduce((acc: Chat[], chat: Chat) => {
                    const otherUser = chat.participants.find((p) => p._id !== meData.user?.id);
                    if (!otherUser) return acc;

                    // Check if we already have a chat with this user
                    const existingIndex = acc.findIndex((c) => {
                        const existingOther = c.participants.find((p) => p._id !== meData.user?.id);
                        return existingOther?._id === otherUser._id;
                    });

                    if (existingIndex === -1) {
                        acc.push(chat);
                    } else {
                        // Keep the one with more recent message
                        const existing = acc[existingIndex];
                        const existingTime = existing.lastMessageAt ? new Date(existing.lastMessageAt).getTime() : 0;
                        const newTime = chat.lastMessageAt ? new Date(chat.lastMessageAt).getTime() : 0;
                        if (newTime > existingTime) {
                            acc[existingIndex] = chat;
                        }
                    }
                    return acc;
                }, []);

                setChats(uniqueChats);
            }
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredChats = chats.filter((chat) => {
        const otherUser = chat.participants.find((p) => p._id !== currentUserId);
        if (!otherUser) return false;

        const searchLower = searchQuery.toLowerCase();
        return (
            otherUser.fullName.toLowerCase().includes(searchLower) ||
            otherUser.username.toLowerCase().includes(searchLower) ||
            chat.lastMessage?.toLowerCase().includes(searchLower)
        );
    });

    const formatTime = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (minutes < 1) return "Now";
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) {
            return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        }
        if (days === 1) return "Yesterday";
        if (days < 7) {
            return date.toLocaleDateString([], { weekday: "short" });
        }
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--brand) mx-auto mb-2" />
                    <p className="text-sm text-(--text-muted)">Loading chats...</p>
                </div>
            </div>
        );
    }

    if (filteredChats.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-(--bg-primary) rounded-full flex items-center justify-center mx-auto mb-3 border border-(--border-color)">
                        <span className="text-3xl">💬</span>
                    </div>
                    <p className="text-(--text-muted) text-sm">
                        {searchQuery ? "No conversations found" : "No messages yet"}
                    </p>
                    <p className="text-(--text-soft) text-xs mt-1">
                        {searchQuery ? "Try a different search" : "Start chatting with your followers"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
            {filteredChats.map((chat) => {
                const otherUser = chat.participants.find((p) => p._id !== currentUserId);
                if (!otherUser) return null;

                const isSelected = selectedChatId === otherUser._id;
                const hasUnread = chat.unreadCount && chat.unreadCount > 0;

                return (
                    <button
                        key={chat._id}
                        onClick={() =>
                            onSelectChat({
                                id: otherUser._id,
                                name: otherUser.fullName,
                                username: otherUser.username,
                                avatar: otherUser.profilePicture,
                                isOnline: false,
                            })
                        }
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-(--hover-bg) transition-colors border-b border-(--border-color)/50 ${isSelected ? "bg-(--hover-bg)" : ""
                            }`}
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            {otherUser.profilePicture ? (
                                <NextImage
                                    src={otherUser.profilePicture}
                                    alt={otherUser.fullName}
                                    width={56}
                                    height={56}
                                    className="rounded-full object-cover border-2 border-(--border-color)"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-(--brand) flex items-center justify-center text-white font-bold text-lg border-2 border-(--border-color)">
                                    {otherUser.fullName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between mb-0.5">
                                <h3 className={`font-semibold text-[15px] truncate ${hasUnread ? "text-(--text-primary)" : "text-(--text-primary)"
                                    }`}>
                                    {otherUser.fullName}
                                </h3>
                                {chat.lastMessageAt && (
                                    <span className={`text-xs shrink-0 ml-2 ${hasUnread ? "text-(--brand) font-semibold" : "text-(--text-muted)"
                                        }`}>
                                        {formatTime(chat.lastMessageAt)}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <p className={`text-sm truncate pr-2 ${hasUnread ? "text-(--text-primary) font-medium" : "text-(--text-muted)"
                                    }`}>
                                    {chat.lastMessage || "Start a conversation"}
                                </p>
                                {hasUnread && (
                                    <span className="shrink-0 w-5 h-5 bg-(--brand) rounded-full flex items-center justify-center">
                                        <span className="text-white text-[10px] font-bold">
                                            {chat.unreadCount}
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
