"use client";

import MessageBubble from "@/components/chat/MessageBubble";
import { ChatMessagesSkeleton } from "@/components/skeletons";
import { useChat } from "@/hooks/useChat";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { Socket } from "socket.io-client";

interface Message {
    _id: string;
    senderId: {
        _id: string;
        username: string;
        fullName: string;
        profilePicture?: string;
    };
    text: string;
    seen: boolean;
    edited?: boolean;
    deleted?: boolean;
    createdAt: string;
}

interface ChatWindowProps {
    socket: Socket | null;
    recipientId: string;
    recipientName: string;
    recipientAvatar?: string;
    currentUserId: string;
}

export default function ChatWindow({
    socket,
    recipientId,
    recipientName,
    recipientAvatar,
    currentUserId,
}: ChatWindowProps) {
    const router = useRouter();
    const [inputText, setInputText] = useState("");
    // const [sending, setSending] = useState(false); // Removed unused state
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        messages,
        isTyping,
        loading,
        error,

        sendMessage,
        editMessage,
        deleteMessage,
        markAsSeen,
    } = useChat({ socket, recipientId, currentUserId });

    // Typing indicator with throttling
    const { startTyping, stopTyping } = useTypingIndicator({
        socket,
        recipientId,
        throttleMs: 500,
        autoStopMs: 5000,
    });

    // Mark messages as seen when chat is viewed
    useEffect(() => {
        if (messages.length > 0 && !loading) {
            markAsSeen();
        }
    }, [messages.length, loading, markAsSeen]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        const text = inputText.trim();
        if (!text) return;

        // Clear input immediately
        setInputText("");
        // setSending(true);

        // Stop typing indicator
        stopTyping();

        // Send message
        sendMessage(text, (success) => {
            // setSending(false);
            if (!success) {
                // Restore text on failure
                setInputText(text);
                // Only show alert on desktop
                if (window.innerWidth >= 768) {
                    alert("Failed to send message. Please try again.");
                }
            }
            inputRef.current?.focus();
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // Find the last message sent by current user that is marked as seen
    // We scan backwards from the end
    const lastSeenMessageId = useMemo(() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (msg.senderId._id === currentUserId && msg.seen) {
                return msg._id;
            }
        }
        return null;
    }, [messages, currentUserId]);

    // Group messages by date
    const groupedMessages = useMemo(() => {
        return messages.reduce((groups: Record<string, Message[]>, message) => {
            const date = new Date(message.createdAt).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});
    }, [messages]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col bg-(--bg-primary) h-full overflow-hidden">
                {/* <ChatWindowHeaderSkeleton /> */}
                <ChatMessagesSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center bg-(--bg-primary)">
                <div className="text-center max-w-md p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-(--text-primary) mb-2">Cannot Start Chat</h3>
                    <p className="text-(--text-muted) mb-4">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => {
                                // Force re-initialization by clearing state
                                window.location.reload();
                            }}
                            className="px-4 py-2 bg-(--brand) text-white rounded-lg hover:opacity-90 transition"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => router.push("/chat")}
                            className="px-4 py-2 bg-(--bg-card) border border-(--border-color) text-(--text-primary) rounded-lg hover:opacity-90 transition"
                        >
                            Back to Chats
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-(--bg-primary) min-h-0 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 overscroll-contain">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center h-full min-h-75">
                        <div className="w-20 h-20 bg-(--bg-card) border border-(--border-color) rounded-full flex items-center justify-center mb-4">
                            <span className="text-4xl">👋</span>
                        </div>
                        <h3 className="text-lg font-semibold text-(--text-primary) mb-2">Start a conversation</h3>
                        <p className="text-sm text-(--text-muted) text-center max-w-xs">
                            Send a message to {recipientName} to start chatting!
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-(--bg-card) border border-(--border-color) text-(--text-muted) text-xs px-3 py-1 rounded-full font-medium">
                                    {date === new Date().toLocaleDateString() ? "Today" : date}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="space-y-2">
                                {msgs.map((message: Message, index: number) => {
                                    const isOwn = message.senderId._id === currentUserId;
                                    const prevMessage = index > 0 ? msgs[index - 1] : null;
                                    const showAvatar = !prevMessage || prevMessage.senderId._id !== message.senderId._id;
                                    const showSeenText = message._id === lastSeenMessageId;

                                    return (
                                        <MessageBubble
                                            key={message._id}
                                            message={message}
                                            isOwn={isOwn}
                                            showAvatar={showAvatar}
                                            recipientAvatar={recipientAvatar}
                                            onEdit={editMessage}
                                            onDelete={deleteMessage}
                                            recipientId={recipientId}
                                            showSeenText={showSeenText}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex items-center gap-2">
                        <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl px-4 py-3 shadow-sm">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-(--brand) rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-(--brand) rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-(--brand) rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 border-t border-(--border-color) p-4 bg-(--bg-card)">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                // Trigger typing indicator when user types
                                if (e.target.value.trim()) {
                                    startTyping();
                                }
                            }}
                            onKeyDown={handleKeyDown}
                            onBlur={() => stopTyping()}
                            placeholder="Type a message..."
                            className="w-full px-4 py-2.5 bg-(--bg-primary) border border-(--border-color) rounded-full text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--brand) focus:border-transparent transition-all disabled:opacity-50"
                            autoComplete="off"
                        />
                    </div>

                    <button
                        type="submit"
                        onMouseDown={(e) => e.preventDefault()}
                        disabled={!inputText.trim()}
                        className="p-3 bg-(--brand) text-white rounded-full hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <FiSend className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
