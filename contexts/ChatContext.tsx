'use client';

import { useSocket } from '@/hooks/useSocket';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ChatContextType {
    countsPerChat: Record<string, number>;
    totalUnreadChats: number;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [countsPerChat, setCountsPerChat] = useState<Record<string, number>>({});
    const [totalUnreadChats, setTotalUnreadChats] = useState(0);
    const [token, setToken] = useState<string | null>(null);

    // Get token for socket connection
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

    const { socket } = useSocket(token);

    // Listen for REAL-TIME count updates (Socket.IO ONLY)
    useEffect(() => {
        if (!socket?.connected) return;

        interface UnreadCountData {
            countsPerChat?: Record<string, number>;
            totalUnreadChats?: number;
        }

        const handleUnreadCountUpdate = (data: UnreadCountData) => {
            console.log('⚡ [UNREAD] Received count update:', data);

            setCountsPerChat(data.countsPerChat || {});
            setTotalUnreadChats(data.totalUnreadChats || 0);

            console.log(`✅ [UNREAD] Updated - Total: ${data.totalUnreadChats} chats with unread`);
        };

        socket.on('unread_count_update', handleUnreadCountUpdate);

        console.log('✅ [ChatContext] Listening for unread_count_update events');

        return () => {
            socket.off('unread_count_update', handleUnreadCountUpdate);
        };
    }, [socket]);

    // Initial load via REST API (ONE TIME ONLY - NO POLLING!)
    useEffect(() => {
        async function fetchInitial() {
            try {
                console.log('🔄 [UNREAD] Fetching initial counts...');
                const res = await fetch('/api/chats/unread-counts', {
                    cache: 'no-store',
                });
                const data = await res.json();

                if (data.success) {
                    setCountsPerChat(data.countsPerChat || {});
                    setTotalUnreadChats(data.totalUnreadChats || 0);
                    console.log(`✅ [UNREAD] Initial load: ${data.totalUnreadChats} chats with unread`);
                }
            } catch (error) {
                console.error('❌ [UNREAD] Initial load failed:', error);
            }
        }
        fetchInitial();
    }, []); // Only once on mount - NO POLLING!

    return (
        <ChatContext.Provider value={{ countsPerChat, totalUnreadChats }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
}
