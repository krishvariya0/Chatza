"use client";

import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import NewChatModal from "@/components/chat/NewChatModal";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useSocket } from "@/hooks/useSocket";
import NextImage from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FiArrowLeft, FiEdit, FiMoreVertical, FiPhone, FiSearch, FiVideo, FiX } from "react-icons/fi";

function ChatPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [selectedChat, setSelectedChat] = useState<{
        id: string;
        name: string;
        username: string;
        avatar?: string;
        isOnline?: boolean;
    } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string>("");

    // Fetch current user once
    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setCurrentUserId(data.user.id);
                }
            })
            .catch(console.error);
    }, []);

    const { socket, isConnected, connectionQuality } = useSocket(token);
    const { isUserOnline } = useOnlineStatus(socket);

    useEffect(() => {
        const getToken = () => {
            const cookies = document.cookie.split(";");
            const sessionCookie = cookies.find((c) => c.trim().startsWith("session="));
            if (sessionCookie) {
                const token = sessionCookie.split("=")[1];
                setToken(token);
            }
        };
        getToken();
    }, []);

    // Handle user query parameter from message button
    const userId = searchParams.get("user");
    const usernameParam = searchParams.get("username");

    useEffect(() => {
        if (userId && usernameParam) {
            // Use a timeout to avoid setState during render
            const timer = setTimeout(() => {
                setSelectedChat({
                    id: userId,
                    name: usernameParam,
                    username: usernameParam,
                    avatar: undefined,
                    isOnline: false,
                });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [userId, usernameParam]);

    // Handle back button on mobile
    const handleBack = () => {
        if (selectedChat) {
            setSelectedChat(null);
        } else {
            router.push("/home");
        }
    };

    // Handle new chat selection
    const handleNewChatSelect = (user: {
        id: string;
        name: string;
        username: string;
        avatar?: string;
        isOnline?: boolean;
    }) => {
        setSelectedChat(user);
        setShowNewChatModal(false);
    };

    return (
        <div className="h-[100dvh] flex bg-(--bg-primary) overflow-hidden">
            {/* Sidebar - Chat List (Hidden on mobile when chat is selected) */}
            <div className={`
                w-full md:w-[350px] lg:w-[400px] border-r border-(--border-color) flex flex-col bg-(--bg-card) h-full overflow-hidden
                ${selectedChat ? 'hidden md:flex' : 'flex'}
            `}>
                {/* Header */}
                <div className="p-4 border-b border-(--border-color)">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push("/home")}
                                className="p-2 hover:bg-(--hover-bg) rounded-full transition-colors"
                                title="Back to home"
                            >
                                <FiArrowLeft className="w-5 h-5 text-(--text-primary)" />
                            </button>
                            <h1 className="text-2xl font-bold text-(--text-primary)">Chats</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setShowSearch(!showSearch);
                                    if (showSearch) setSearchQuery("");
                                }}
                                className={`p-2 rounded-full transition-colors ${showSearch ? 'bg-(--brand) text-white' : 'hover:bg-(--hover-bg) text-(--text-primary)'}`}
                                title="Search"
                            >
                                {showSearch ? <FiX className="w-5 h-5" /> : <FiSearch className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setShowNewChatModal(true)}
                                className="w-10 h-10 bg-(--brand) hover:opacity-90 rounded-full flex items-center justify-center transition-colors"
                                title="New message"
                            >
                                <FiEdit className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Search - Expandable */}
                    {showSearch && (
                        <div className="mt-4 relative animate-in slide-in-from-top duration-200">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted) w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full pl-10 pr-4 py-2.5 bg-(--bg-primary) border border-(--border-color) rounded-full text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--brand) transition-all"
                            />
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-(--border-color)">
                    <button className="flex-1 py-3 text-sm font-semibold text-(--text-primary) border-b-2 border-(--brand) transition-colors">
                        All
                    </button>
                    <button className="flex-1 py-3 text-sm font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors">
                        Unread
                    </button>
                    <button className="flex-1 py-3 text-sm font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors">
                        Groups
                    </button>
                </div>

                {/* Connection Status - Enhanced */}
                {!isConnected && token && (
                    <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                            Using fallback mode (Polling every 2s)
                        </p>
                    </div>
                )}

                {isConnected && (
                    <div className={`px-4 py-2 border-b ${connectionQuality === 'excellent' ? 'bg-green-500/10 border-green-500/20' :
                        connectionQuality === 'good' ? 'bg-blue-500/10 border-blue-500/20' :
                            'bg-orange-500/10 border-orange-500/20'
                        }`}>
                        <p className={`text-xs flex items-center gap-2 ${connectionQuality === 'excellent' ? 'text-green-600 dark:text-green-400' :
                            connectionQuality === 'good' ? 'text-blue-600 dark:text-blue-400' :
                                'text-orange-600 dark:text-orange-400'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${connectionQuality === 'excellent' ? 'bg-green-500' :
                                connectionQuality === 'good' ? 'bg-blue-500' :
                                    'bg-orange-500'
                                }`} />
                            Real-time connected ({connectionQuality})
                        </p>
                    </div>
                )}

                {/* Chat List */}
                <ChatList
                    socket={socket}
                    searchQuery={searchQuery}
                    selectedChatId={selectedChat?.id}
                    onSelectChat={setSelectedChat}
                    currentUserId={currentUserId}
                />
            </div>

            {/* Chat Window (Full screen on mobile when chat is selected) */}
            <div className={`
                flex-1 flex flex-col bg-(--bg-primary) h-full overflow-hidden
                ${selectedChat ? 'flex' : 'hidden md:flex'}
            `}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 shrink-0 border-b border-(--border-color) flex items-center justify-between px-4 md:px-6 bg-(--bg-card)">
                            <div className="flex items-center gap-3">
                                {/* Back button - visible on mobile */}
                                <button
                                    onClick={handleBack}
                                    className="p-2 hover:bg-(--hover-bg) rounded-full transition-colors md:hidden"
                                    title="Back"
                                >
                                    <FiArrowLeft className="w-5 h-5 text-(--text-primary)" />
                                </button>
                                <div className="relative">
                                    {selectedChat.avatar ? (
                                        <NextImage
                                            src={selectedChat.avatar}
                                            alt={selectedChat.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover border-2 border-(--border-color)"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-(--brand) flex items-center justify-center text-white font-bold border-2 border-(--border-color)">
                                            {selectedChat.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    {/* Online status indicator */}
                                    {selectedChat && isUserOnline(selectedChat.id) && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-(--text-primary)">{selectedChat.name}</h2>
                                    <p className="text-xs text-(--text-muted)">
                                        {isUserOnline(selectedChat.id) ? (
                                            <span className="text-green-500">online</span>
                                        ) : (
                                            `@${selectedChat.username}`
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    className="p-2 hover:bg-(--hover-bg) rounded-full transition-colors"
                                    title="Voice call"
                                >
                                    <FiPhone className="w-5 h-5 text-(--text-muted)" />
                                </button>
                                <button
                                    className="p-2 hover:bg-(--hover-bg) rounded-full transition-colors"
                                    title="Video call"
                                >
                                    <FiVideo className="w-5 h-5 text-(--text-muted)" />
                                </button>
                                <button
                                    className="p-2 hover:bg-(--hover-bg) rounded-full transition-colors"
                                    title="More options"
                                >
                                    <FiMoreVertical className="w-5 h-5 text-(--text-muted)" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <ChatWindow
                            key={selectedChat.id}
                            socket={socket}
                            recipientId={selectedChat.id}
                            recipientName={selectedChat.name}
                            recipientAvatar={selectedChat.avatar}
                            currentUserId={currentUserId}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-(--text-muted) bg-(--bg-primary)">
                        <div className="w-24 h-24 bg-(--bg-card) rounded-full flex items-center justify-center mb-4 shadow-sm border border-(--border-color)">
                            <FiEdit className="w-12 h-12 text-(--text-soft)" />
                        </div>
                        <h3 className="text-xl font-semibold text-(--text-primary) mb-2">Your Messages</h3>
                        <p className="text-sm text-center max-w-xs text-(--text-muted) mb-4">
                            Send private messages to friends. Select a chat or start a new conversation.
                        </p>
                        <button
                            onClick={() => setShowNewChatModal(true)}
                            className="px-6 py-2.5 bg-(--brand) text-white rounded-full hover:opacity-90 transition-colors font-medium"
                        >
                            Start New Chat
                        </button>
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            <NewChatModal
                isOpen={showNewChatModal}
                onClose={() => setShowNewChatModal(false)}
                onSelectUser={handleNewChatSelect}
            />
        </div>
    );
}

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ChatProvider } from "@/contexts/ChatContext";

export default function ChatPage() {
    return (
        <AuthGuard>
            <ChatProvider>
                <Suspense fallback={<ChatPageSkeleton />}>
                    <ChatPageContent />
                </Suspense>
            </ChatProvider>
        </AuthGuard>
    );
}

function ChatPageSkeleton() {
    return (
        <div className="h-[100dvh] flex bg-(--bg-primary) overflow-hidden">
            <div className="w-full md:w-[350px] lg:w-[400px] border-r border-(--border-color) flex flex-col bg-(--bg-card) h-full overflow-hidden">
                <div className="p-4 border-b border-(--border-color) animate-pulse">
                    <div className="h-8 bg-(--bg-primary) rounded w-24 mb-2"></div>
                </div>
            </div>
            <div className="flex-1 bg-(--bg-primary) hidden md:flex"></div>
        </div>
    );
}
