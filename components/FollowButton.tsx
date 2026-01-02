'use client';

import { showToast } from '@/lib/toast';
import { useState } from 'react';

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    initialIsFollower: boolean;
    isCurrentUser: boolean;
    onFollowChange?: (isFollowing: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
}

export function FollowButton({
    targetUserId,
    initialIsFollowing,
    initialIsFollower,
    isCurrentUser,
    onFollowChange,
    size = 'md',
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);

    const handleFollow = async () => {
        if (loading) return;

        setLoading(true);
        const previousState = isFollowing;

        // Optimistic update
        setIsFollowing(true);
        onFollowChange?.(true);

        try {
            const res = await fetch('/api/follow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Failed to follow');
            }

            showToast.success(initialIsFollower ? 'Followed back!' : 'Following!');
        } catch (error) {
            // Rollback on error
            setIsFollowing(previousState);
            onFollowChange?.(previousState);
            const errorMessage = error instanceof Error ? error.message : 'Failed to follow user';
            showToast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async () => {
        if (loading) return;

        setLoading(true);
        const previousState = isFollowing;

        // Optimistic update
        setIsFollowing(false);
        onFollowChange?.(false);

        try {
            const res = await fetch('/api/unfollow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Failed to unfollow');
            }

            showToast.success('Unfollowed');
        } catch (error) {
            // Rollback on error
            setIsFollowing(previousState);
            onFollowChange?.(previousState);
            const errorMessage = error instanceof Error ? error.message : 'Failed to unfollow user';
            showToast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (isCurrentUser) {
        return (
            <button
                className={`
          ${size === 'sm' ? 'px-4 py-1.5 text-sm' : size === 'lg' ? 'px-8 py-3 text-base' : 'px-6 py-2 text-sm'}
          rounded-lg font-semibold transition-colors
          bg-(--border-color) text-(--text-primary) border border-(--border-color)
          hover:bg-(--hover-bg)
        `}
                onClick={() => window.location.href = '/profile/edit'}
            >
                Edit Profile
            </button>
        );
    }

    if (isFollowing) {
        return (
            <button
                onClick={handleUnfollow}
                disabled={loading}
                className={`
          ${size === 'sm' ? 'px-4 py-1.5 text-sm' : size === 'lg' ? 'px-8 py-3 text-base' : 'px-6 py-2 text-sm'}
          rounded-lg font-semibold transition-colors
          border-2 border-(--border-color) bg-(--bg-card)
          text-(--text-primary)
          hover:border-(--accent-red) hover:text-(--accent-red) hover:bg-(--hover-red)
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
            >
                {loading ? 'Loading...' : 'Following'}
            </button>
        );
    }

    // Follow or Follow Back button
    const isFollowBack = initialIsFollower && !isFollowing;

    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            style={isFollowBack ? { background: 'var(--gradient-pink-red)' } : undefined}
            className={`
        ${size === 'sm' ? 'px-4 py-1.5 text-sm' : size === 'lg' ? 'px-8 py-3 text-base' : 'px-6 py-2 text-sm'}
        rounded-lg font-semibold transition-colors text-white
        ${isFollowBack
                    ? 'hover:opacity-90'
                    : 'bg-(--brand) hover:opacity-90'
                }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
        >
            {loading ? 'Loading...' : isFollowBack ? 'Follow Back' : 'Follow'}
        </button>
    );
}
