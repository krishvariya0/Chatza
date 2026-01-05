"use client";

import NextImage from "next/image";
import { useEffect, useState } from "react";
import { FiMessageCircle, FiSearch, FiX } from "react-icons/fi";

interface MutualFollower {
    _id: string;
    username: string;
    fullName: string;
    profilePicture?: string;
}

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectUser: (user: {
        id: string;
        name: string;
        username: string;
        avatar?: string;
        isOnline?: boolean;
    }) => void;
}

export default function NewChatModal({ isOpen, onClose, onSelectUser }: NewChatModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [mutualFollowers, setMutualFollowers] = useState<MutualFollower[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchMutualFollowers();
        }
    }, [isOpen]);

    const fetchMutualFollowers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/users/mutual-followers");
            const data = await res.json();

            if (res.ok && data.success) {
                setMutualFollowers(data.mutualFollowers || []);
            } else {
                setError(data.message || "Failed to load contacts");
            }
        } catch {
            setError("Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    const filteredFollowers = mutualFollowers.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.fullName.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        );
    });

    const handleSelectUser = (user: MutualFollower) => {
        onSelectUser({
            id: user._id,
            name: user.fullName,
            username: user.username,
            avatar: user.profilePicture,
            isOnline: false,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 bg-(--bg-card) rounded-2xl shadow-2xl border border-(--border-color) overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-(--border-color)">
                    <h2 className="text-lg font-semibold text-(--text-primary)">New Message</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-(--hover-bg) rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5 text-(--text-muted)" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-(--border-color)">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted) w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search mutual followers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="w-full pl-10 pr-4 py-2.5 bg-(--bg-primary) border border-(--border-color) rounded-full text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--brand) transition-all"
                        />
                    </div>
                    <p className="text-xs text-(--text-muted) mt-2">
                        You can only message people who follow you back
                    </p>
                </div>

                {/* User List */}
                <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--brand) mx-auto mb-2" />
                                <p className="text-sm text-(--text-muted)">Loading contacts...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="text-sm text-(--brand)">{error}</p>
                                <button
                                    onClick={fetchMutualFollowers}
                                    className="mt-2 text-sm text-(--text-primary) hover:underline"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    ) : filteredFollowers.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-(--bg-primary) rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FiMessageCircle className="w-6 h-6 text-(--text-soft)" />
                                </div>
                                <p className="text-sm text-(--text-muted)">
                                    {searchQuery ? "No users found" : "No mutual followers yet"}
                                </p>
                                <p className="text-xs text-(--text-soft) mt-1">
                                    Follow people and wait for them to follow back
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {filteredFollowers.map((user) => (
                                <button
                                    key={user._id}
                                    onClick={() => handleSelectUser(user)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-(--hover-bg) transition-colors"
                                >
                                    <div className="relative shrink-0">
                                        {user.profilePicture ? (
                                            <NextImage
                                                src={user.profilePicture}
                                                alt={user.fullName}
                                                width={48}
                                                height={48}
                                                className="rounded-full object-cover border-2 border-(--border-color)"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-(--brand) flex items-center justify-center text-white font-bold text-lg border-2 border-(--border-color)">
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <h3 className="font-semibold text-(--text-primary) truncate">
                                            {user.fullName}
                                        </h3>
                                        <p className="text-sm text-(--text-muted) truncate">
                                            @{user.username}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
