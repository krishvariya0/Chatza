"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Search, User as UserIcon, X } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchUser {
    id: string;
    username: string;
    fullName: string;
    profilePicture: string | null;
    bio: string;
}

export default function FindPage() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [searchHistory, setSearchHistory] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);

    // Load search history from database
    useEffect(() => {
        fetchSearchHistory();
    }, []);

    const fetchSearchHistory = async () => {
        try {
            const res = await fetch("/api/users/search?history=true");
            const data = await res.json();

            if (res.ok) {
                setSearchHistory(data.users || []);
            }
        } catch (error) {
            console.error("Failed to load search history:", error);
        } finally {
            setHistoryLoading(false);
        }
    };

    // Search users with debounce
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (query.trim()) {
                performSearch(query);
            } else {
                setSearchResults([]);
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [query]);

    const performSearch = async (searchQuery: string) => {
        setLoading(true);
        setIsSearching(true);
        try {
            const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();

            if (res.ok) {
                setSearchResults(data.users || []);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = async (user: SearchUser) => {
        // Add to search history in database
        try {
            await fetch("/api/users/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ searchedUserId: user.id }),
            });

            // Update local state
            const updatedHistory = [
                user,
                ...searchHistory.filter((u) => u.id !== user.id),
            ].slice(0, 10);
            setSearchHistory(updatedHistory);
        } catch (error) {
            console.error("Failed to save search history:", error);
        }

        // Navigate to profile with referrer
        router.push(`/profile/${user.username}?from=find`);
    };

    const removeFromHistory = async (userId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            const res = await fetch(`/api/users/search?userId=${userId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                const updatedHistory = searchHistory.filter((u) => u.id !== userId);
                setSearchHistory(updatedHistory);
            }
        } catch (error) {
            console.error("Failed to remove from history:", error);
        }
    };

    const UserCard = ({ user, showDelete = false }: { user: SearchUser; showDelete?: boolean }) => (
        <div
            onClick={() => handleUserClick(user)}
            className="flex items-center gap-3 rounded-xl p-3 sm:p-3.5 hover:bg-(--card-hover) cursor-pointer transition-all group active:scale-[0.98]"
        >
            <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-(--border-color) overflow-hidden shrink-0">
                {user.profilePicture ? (
                    <NextImage
                        src={user.profilePicture}
                        alt={user.fullName}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <UserIcon size={20} className="sm:w-6 sm:h-6 text-(--text-soft)" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-(--text-primary) truncate">
                    {user.fullName}
                </p>
                <p className="text-xs sm:text-sm text-(--text-muted) truncate">@{user.username}</p>
                {user.bio && (
                    <p className="text-xs text-(--text-soft) truncate mt-0.5 hidden sm:block">{user.bio}</p>
                )}
            </div>
            {showDelete && (
                <button
                    onClick={(e) => removeFromHistory(user.id, e)}
                    className="sm:opacity-0 sm:group-hover:opacity-100 transition p-1.5 sm:p-2 hover:bg-(--bg-primary) rounded-full shrink-0"
                    title="Remove from history"
                >
                    <X size={16} className="sm:w-4 sm:h-4 text-(--text-muted)" />
                </button>
            )}
        </div>
    );

    return (
        <AppLayout>
            <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                {/* Search Input */}
                <div className="sticky top-0 z-10 bg-(--bg-primary) pb-3 sm:pb-4">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name or username"
                            className="w-full rounded-xl border border-(--border-color) bg-(--card-bg) py-2.5 sm:py-3 pl-10 sm:pl-11 pr-10 sm:pr-11 text-sm sm:text-base text-(--text-primary) outline-none focus:ring-2 focus:ring-(--brand) transition"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary) transition"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="mt-4 sm:mt-6">
                    {!isSearching && historyLoading && (
                        <div className="space-y-2 sm:space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-xl p-3 sm:p-3.5 animate-pulse"
                                >
                                    <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-(--border-color)" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-(--border-color) rounded w-28 sm:w-32 mb-2" />
                                        <div className="h-3 bg-(--border-color) rounded w-20 sm:w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isSearching && !historyLoading && searchHistory.length > 0 && (
                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-xs sm:text-sm font-semibold text-(--text-primary) mb-2 sm:mb-3 px-1 sm:px-2">
                                Recent Searches
                            </h2>
                            <div className="space-y-1">
                                {searchHistory.map((user) => (
                                    <UserCard key={user.id} user={user} showDelete={true} />
                                ))}
                            </div>
                        </div>
                    )}

                    {!query && !isSearching && !historyLoading && searchHistory.length === 0 && (
                        <div className="text-center text-sm sm:text-base text-(--text-muted) mt-16 sm:mt-20 px-4">
                            <Search size={40} className="sm:w-12 sm:h-12 mx-auto mb-3 opacity-30" />
                            <p>Start typing to search users</p>
                        </div>
                    )}

                    {isSearching && (
                        <div>
                            <h2 className="text-xs sm:text-sm font-semibold text-(--text-primary) mb-2 sm:mb-3 px-1 sm:px-2">
                                Search Results
                            </h2>
                            {loading ? (
                                <div className="space-y-2 sm:space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 rounded-xl p-3 sm:p-3.5 animate-pulse"
                                        >
                                            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-(--border-color)" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-(--border-color) rounded w-28 sm:w-32 mb-2" />
                                                <div className="h-3 bg-(--border-color) rounded w-20 sm:w-24" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="space-y-1">
                                    {searchResults.map((user) => (
                                        <UserCard key={user.id} user={user} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-sm sm:text-base text-(--text-muted) mt-8 sm:mt-12 px-4">
                                    <p>No users found for "{query}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
