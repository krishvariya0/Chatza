"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

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

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
    showAvatar: boolean;
    recipientAvatar?: string;
    onEdit: (messageId: string, newText: string, recipientId: string) => void;
    onDelete: (messageId: string, recipientId: string) => void;
    recipientId: string;
}

export default function MessageBubble({
    message,
    isOwn,
    showAvatar,
    recipientAvatar,
    onEdit,
    onDelete,
    recipientId,
}: MessageBubbleProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.text);

    /* ✅ SAFE TIME STATE (NO IMPURE CALLS IN RENDER) */
    const [now, setNow] = useState<number>(() => Date.now());

    const menuRef = useRef<HTMLDivElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);

    /* ✅ UPDATE TIME OUTSIDE RENDER */
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 30_000); // update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    /* ✅ DERIVED STATE (PURE) */
    const canEdit = useMemo(() => {
        if (!isOwn || message.deleted) return false;

        const messageTime = new Date(message.createdAt).getTime();
        const tenMinutes = 10 * 60 * 1000;

        return now - messageTime < tenMinutes;
    }, [now, message.createdAt, isOwn, message.deleted]);

    /* Close menu on outside click */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* Focus input when editing */
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

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"
                }`}
        >
            {/* Avatar */}
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

            {/* Message Bubble */}
            <div
                className="relative max-w-[70%]"
                onMouseEnter={() => isOwn && canEdit && setShowMenu(true)}
                onMouseLeave={() => !isEditing && setShowMenu(false)}
            >
                {isEditing ? (
                    <div className="bg-white border-2 border-red-500 rounded-2xl p-3 shadow-lg min-w-[200px]">
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
                            className="w-full px-2 py-1 outline-none text-sm"
                        />

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handleEdit}
                                className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs"
                            >
                                <FiCheck className="inline mr-1" /> Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditText(message.text);
                                }}
                                className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs"
                            >
                                <FiX className="inline mr-1" /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div
                            className={`rounded-2xl px-4 py-2 ${isOwn ? "bg-red-500 text-white" : "bg-gray-200 text-gray-900"
                                } ${message.deleted ? "italic opacity-60" : ""}`}
                        >
                            <p className="break-words text-sm">{message.text}</p>

                            <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                                <span>{formatTime(message.createdAt)}</span>
                                {message.edited && !message.deleted && <span>• Edited</span>}
                                {isOwn && !message.deleted && (
                                    message.seen ? (
                                        <>
                                            <FiCheck className="text-blue-300" />
                                            <FiCheck className="text-blue-300" />
                                        </>
                                    ) : (
                                        <FiCheck className="text-red-100" />
                                    )
                                )}
                            </div>
                        </div>

                        {showMenu && canEdit && !message.deleted && (
                            <div
                                ref={menuRef}
                                className="absolute top-0 right-full mr-2 bg-white rounded-lg shadow border py-1 min-w-[120px]"
                            >
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <FiEdit2 /> Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-500 flex items-center gap-2"
                                >
                                    <FiTrash2 /> Delete
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
