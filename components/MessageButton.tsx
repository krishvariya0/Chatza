'use client';

import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MessageButtonProps {
    targetUserId: string;
    targetUsername: string;
    isMutualFollow: boolean;
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

export function MessageButton({
    targetUserId,
    targetUsername,
    isMutualFollow,
    size = 'md',
    showText = true,
}: MessageButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Only show message button if mutual follow
    if (!isMutualFollow) {
        return null;
    }

    const handleMessage = async () => {
        setLoading(true);
        // Navigate to chat page with the user selected
        router.push(`/chat?user=${targetUserId}&username=${targetUsername}`);
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-2.5 text-base',
    };

    const iconSizes = {
        sm: 14,
        md: 16,
        lg: 18,
    };

    return (
        <button
            onClick={handleMessage}
            disabled={loading}
            className={`
                ${sizeClasses[size]}
                rounded-lg font-semibold transition-all
                bg-(--bg-card) border-2 border-(--brand)
                text-(--brand)
                hover:bg-(--brand) hover:text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
            `}
        >
            <MessageCircle size={iconSizes[size]} />
            {showText && (loading ? 'Opening...' : 'Message')}
        </button>
    );
}
