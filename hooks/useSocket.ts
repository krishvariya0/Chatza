import { socketClient } from "@/lib/socket";
import { logger } from "@/utils/logger";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export function useSocket(token: string | null) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            socketClient.disconnect();
            setSocket(null);
            setIsConnected(false);
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
            };

            const handleDisconnect = (reason: string) => {
                logger.log("❌ [SOCKET] Disconnected - Reason:", reason);
                setIsConnected(false);
            };

            const handleError = (error: Error) => {
                logger.warn("⚠️ [SOCKET] Connection error:", error.message || error);
                setIsConnected(false);
            };

            socketInstance.on("connect", handleConnect);
            socketInstance.on("disconnect", handleDisconnect);
            socketInstance.on("connect_error", handleError);

            setIsConnected(socketInstance.connected);

            return () => {
                socketInstance.off("connect", handleConnect);
                socketInstance.off("disconnect", handleDisconnect);
                socketInstance.off("connect_error", handleError);
            };
        } catch (error) {
            logger.error("Failed to create socket:", error);
        }
    }, [token]);

    return { socket, isConnected };
}
