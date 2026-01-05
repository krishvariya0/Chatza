import { logger } from "@/utils/logger";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

class SocketClient {
    private socket: Socket | null = null;

    connect(token: string): Socket | null {
        if (this.socket?.connected) {
            return this.socket;
        }

        try {
            this.socket = io(SOCKET_URL, {
                auth: { token },
                autoConnect: true,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                transports: ['websocket', 'polling'],
            });

            this.socket.on("connect", () => {
                logger.log("✅ [SOCKET] Connected to chat server at", SOCKET_URL);
                logger.log("✅ [SOCKET] Socket ID:", this.socket?.id);
            });

            this.socket.on("disconnect", (reason: string) => {
                logger.log("❌ [SOCKET] Disconnected from chat server:", reason);
            });

            this.socket.on("connect_error", (error: Error) => {
                logger.warn("⚠️ [SOCKET] Connection error:", error.message);
                logger.warn("⚠️ [SOCKET] Make sure chat server is running at:", SOCKET_URL);
            });

            return this.socket;
        } catch (error) {
            logger.error("Failed to create socket:", error);
            return null;
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const socketClient = new SocketClient();
