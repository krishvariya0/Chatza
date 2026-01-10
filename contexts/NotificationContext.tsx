'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface NotificationContextType {
    unreadCount: number;
    refreshUnreadCount: () => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    const refreshUnreadCount = async () => {
        try {
            const res = await fetch('/api/notifications/unread-count', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            // If unauthorized, silently fail (user not logged in)
            if (res.status === 401) {
                setUnreadCount(0);
                return;
            }

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (data.success) {
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            // Only log error if it's not a network error during initial load
            if (isInitialized) {
                console.error('Error fetching unread count:', error);
            }
            setUnreadCount(0);
        }
    };

    const markAllAsRead = async () => {
        try {
            const res = await fetch('/api/notifications/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (res.ok) {
                setUnreadCount(0);
                // Refresh after a short delay to ensure backend is updated
                setTimeout(refreshUnreadCount, 1000);
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    // Fetch unread count on mount
    useEffect(() => {
        // Add a small delay to ensure the app is fully loaded
        const initTimer = setTimeout(() => {
            setIsInitialized(true);
            refreshUnreadCount();
        }, 500);

        // Poll for new notifications every 30 seconds
        const interval = setInterval(refreshUnreadCount, 30000);

        return () => {
            clearTimeout(initTimer);
            clearInterval(interval);
        };
    }, [refreshUnreadCount]);

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}
