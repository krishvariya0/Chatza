"use client";

import { CheckCheck, MoreVertical } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiCornerUpLeft, FiEdit2, FiTrash2 } from "react-icons/fi";

interface Message {
    _id: string;
    chatId: string;
    senderId: {
        _id: string;
        username: string;
        fullName: string;
        profilePicture?: string;
    };
    text: string;
    seen: boolean;
    seenAt?: string;
    edited?: boolean;
    deleted?: boolean;
    createdAt: string;
    replyTo?: {
        messageId: string;
        text: string;
        senderId: string;
        senderName: string;
    };
}

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
    showAvatar: boolean;
    recipientAvatar?: string;
    onEdit: (messageId: string, newText: string, recipientId: string) => void;
    onDelete: (messageId: string, recipientId: string) => void;
    onReply: (message: Message) => void;
    recipientId: string;
    showSeenText?: boolean;
}

export default function MessageBubble({
    message,
    isOwn,
    showAvatar,
    recipientAvatar,
    onEdit,
    onDelete,
    onReply,
    recipientId,
    showSeenText = false,
}: MessageBubbleProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.text);
    const [swipeOffset, setSwipeOffset] = useState(0);

    const [now, setNow] = useState<number>(() => Date.now());

    const menuRef = useRef<HTMLDivElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout>(null);
    const longPressTimeoutRef = useRef<NodeJS.Timeout>(null);
    const touchStartRef = useRef<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 30_000);
        return () => clearInterval(interval);
    }, []);

    const canEdit = useMemo(() => {
        if (!isOwn || message.deleted) return false;
        const diff = now - new Date(message.createdAt).getTime();
        return diff < 10 * 60 * 1000;
    }, [now, message.createdAt, isOwn, message.deleted]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [isEditing]);

    const handleEdit = () => {
        if (editText.trim() && editText !== message.text) {
            onEdit(message._id, editText, recipientId);
            setIsEditing(false);
            setShowMenu(false);
        }
    };

    const handleDelete = () => {
        if (confirm("Delete this message? This cannot be undone.")) {
            onDelete(message._id, recipientId);
            setShowMenu(false);
        }
    };

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            if (!showMenu) setShowMenu(false);
        }, 500);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = e.touches[0].clientX;
        longPressTimeoutRef.current = setTimeout(() => {
            if (isOwn && canEdit && !message.deleted && swipeOffset === 0) {
                if (navigator.vibrate) navigator.vibrate(50);
                setIsHovered(true);
                setShowMenu(true);
            }
        }, 500);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartRef.current !== null) {
            const diff = e.touches[0].clientX - touchStartRef.current;
            if (diff > 0 && diff < 100) {
                setSwipeOffset(diff);
                if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
            }
        }
    };

    const handleTouchEnd = () => {
        if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
        if (swipeOffset > 50) {
            if (navigator.vibrate) navigator.vibrate(20);
            onReply(message);
        }
        setSwipeOffset(0);
        touchStartRef.current = null;
    };

    const formatTime = (dateString: string) =>
        new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const formatSeenTime = (dateString: string) => {
        const date = new Date(dateString);
        const diff = now - date.getTime();
        const m = Math.floor(diff / 60000);
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(diff / 86400000);
        if (m < 1) return "just now";
        if (m < 60) return `${m}m ago`;
        if (h < 24) return `${h}h ago`;
        if (d === 1) return "yesterday";
        if (d < 7) return `${d} days ago`;
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    };

    return (
        <div className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
            {showAvatar && !isOwn ? (
                recipientAvatar ? (
                    <Image
                        src={recipientAvatar}
                        alt={message.senderId.fullName}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                        unoptimized
                    />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-300 shrink-0 flex items-center justify-center text-xs text-gray-600">
                        {message.senderId.fullName.charAt(0).toUpperCase()}
                    </div>
                )
            ) : (
                !isOwn && <div className="w-7" />
            )}

            <div
                className="relative max-w-[70%] group transition-transform duration-200 ease-out"
                style={{ transform: `translateX(${swipeOffset}px)` }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {swipeOffset > 0 && (
                    <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 text-gray-400">
                        <FiCornerUpLeft className={`w-5 h-5 ${swipeOffset > 50 ? "scale-125 text-(--brand)" : ""}`} />
                    </div>
                )}

                {isEditing ? (
                    <div className="bg-(--bg-card) border-2 border-(--brand) rounded-2xl p-3 shadow-lg min-w-[200px]">
                        <input
                            ref={editInputRef}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleEdit();
                                if (e.key === "Escape") {
                                    setIsEditing(false);
                                    setEditText(message.text);
                                }
                            }}
                            className="w-full px-2 py-1 outline-none text-sm bg-(--bg-primary) text-(--text-primary)"
                        />
                    </div>
                ) : (
                    <div className="relative">
                        {/* MAIN BUBBLE */}
                        <div
                            className={`rounded-2xl px-4 py-2 relative ${isOwn ? "bg-red-500 text-white" : "bg-gray-200 text-gray-900"
                                } ${message.deleted ? "italic opacity-60" : ""}`}
                        >
                            {/* ✅ REPLY CONTEXT (ONLY MOVED HERE) */}
                            {message.replyTo && (
                                <div
                                    className={`mb-2 flex gap-2 px-3 py-2 rounded-xl
        ${isOwn ? "bg-white/10" : "bg-(--bg-primary)"}`}
                                >
                                    {/* LEFT COLORED BAR */}
                                    <div
                                        className={`w-1 rounded-full
            ${isOwn ? "bg-white/70" : "bg-(--brand)"}`}
                                    />

                                    {/* CONTENT */}
                                    <div className="flex flex-col min-w-0">
                                        <span
                                            className={`text-[11px] font-medium leading-tight
                ${isOwn ? "text-white/80" : "text-(--brand)"}`}
                                        >
                                            {isOwn ? "You replied to" : "Replying to"}{" "}
                                            {message.replyTo.senderName || "User"}
                                        </span>

                                        <span
                                            className={`text-[12px] leading-snug truncate
                ${isOwn ? "text-white/90" : "text-(--text-muted)"}`}
                                        >
                                            {message.replyTo.text}
                                        </span>
                                    </div>
                                </div>
                            )}


                            <p className="break-words text-sm">{message.text}</p>

                            <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                                <span>{formatTime(message.createdAt)}</span>
                                {message.edited && !message.deleted && <span>• Edited</span>}
                                {isOwn && !message.deleted && (
                                    <div className="flex items-center ml-1">
                                        {message.seen ? (
                                            <CheckCheck className="w-3.5 h-3.5 text-white" />
                                        ) : (
                                            <FiCheck className="w-3.5 h-3.5 opacity-70 stroke-[3]" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isEditing && !message.deleted && (isHovered || showMenu) && (
                            <div
                                className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 ${isOwn ? "right-full mr-2 flex-row-reverse" : "left-full ml-2 flex-row"
                                    }`}
                            >
                                <button
                                    onClick={() => onReply(message)}
                                    className="p-2 rounded-full bg-(--bg-card) border border-(--border-color)
                                    shadow-sm hover:bg-(--hover-bg) text-(--text-muted) transition-all hidden md:flex"
                                >
                                    <FiCornerUpLeft className="w-4 h-4" />
                                </button>

                                {isOwn && canEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenu(!showMenu);
                                        }}
                                        className="p-1.5 rounded-full bg-(--bg-card) border border-(--border-color)
                                        shadow-sm hover:bg-(--hover-bg)"
                                    >
                                        <MoreVertical className="w-3.5 h-3.5 text-(--text-muted)" />
                                    </button>
                                )}
                            </div>
                        )}

                        {showMenu && canEdit && !message.deleted && (
                            <div
                                ref={menuRef}
                                className={`absolute top-1/2 -translate-y-1/2 ${isOwn ? "right-full mr-24" : "left-full ml-24"
                                    } bg-(--bg-card) rounded-lg shadow-lg border
                                border-(--border-color) py-1 min-w-[120px] z-50`}
                            >
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-(--hover-bg)
                                    text-(--text-primary) flex items-center gap-2"
                                >
                                    <FiEdit2 /> Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50
                                    dark:hover:bg-red-950 text-red-500 flex items-center gap-2"
                                >
                                    <FiTrash2 /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {isOwn && message.seen && !message.deleted && showSeenText && (
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 ml-auto text-right">
                        Seen {formatSeenTime(message.seenAt || message.createdAt)}
                    </div>
                )}
            </div>
        </div>
    );
}
