import { socketClient } from "@/lib/socket";
import { logger } from "@/utils/logger";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export function useSocket(token: string | null) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionQuality, setConnectionQuality] = useState<
        "excellent" | "good" | "poor" | "disconnected"
    >("disconnected");
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        if (!token) {
            socketClient.disconnect();
            setSocket(null);
            setIsConnected(false);
            setConnectionQuality("disconnected");
            setReconnectAttempts(0);
            return;
        }

        try {
            const socketInstance = socketClient.connect(token);
            if (!socketInstance) {
                logger.error("Failed to create socket instance");
                return;
            }

            setSocket(socketInstance);

            const handleConnect = () => {
                logger.log("✅ [SOCKET] Connected - Socket ID:", socketInstance.id);
                setIsConnected(true);
                setConnectionQuality(socketClient.getConnectionQuality());
                setReconnectAttempts(0);
            };

            const handleDisconnect = (reason: string) => {
                logger.log("❌ [SOCKET] Disconnected - Reason:", reason);
                setIsConnected(false);
                setConnectionQuality("disconnected");
            };

            const handleError = (error: Error) => {
                logger.warn("⚠️ [SOCKET] Connection error:", error.message || error);
                setIsConnected(false);
                setConnectionQuality("disconnected");
                const stats = socketClient.getStats();
                setReconnectAttempts(stats.reconnectAttempts);
            };

            const handleReconnect = () => {
                logger.log("✅ [SOCKET] Reconnected successfully");
                setIsConnected(true);
                setConnectionQuality(socketClient.getConnectionQuality());
            };

            socketInstance.on("connect", handleConnect);
            socketInstance.on("disconnect", handleDisconnect);
            socketInstance.on("connect_error", handleError);
            socketInstance.on("reconnect", handleReconnect);

            setIsConnected(socketInstance.connected);
            setConnectionQuality(socketClient.getConnectionQuality());

            return () => {
                socketInstance.off("connect", handleConnect);
                socketInstance.off("disconnect", handleDisconnect);
                socketInstance.off("connect_error", handleError);
                socketInstance.off("reconnect", handleReconnect);
            };
        } catch (error) {
            logger.error("Failed to create socket:", error);
        }
    }, [token]);

    return {
        socket,
        isConnected,
        connectionQuality,
        reconnectAttempts,
    };
}
