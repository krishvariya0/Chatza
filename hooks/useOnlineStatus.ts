import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

/**
 * Hook to track online status of users
 */
export function useOnlineStatus(socket: Socket | null) {
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!socket) return;

        const handleUserOnline = ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => new Set(prev).add(userId));
        };

        const handleUserOffline = ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        };

        socket.on("user_online", handleUserOnline);
        socket.on("user_offline", handleUserOffline);

        return () => {
            socket.off("user_online", handleUserOnline);
            socket.off("user_offline", handleUserOffline);
        };
    }, [socket]);

    const isUserOnline = (userId: string) => onlineUsers.has(userId);

    return { onlineUsers, isUserOnline };
}
