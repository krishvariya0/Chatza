import { logger } from "@/utils/logger";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:3001";

interface ConnectionStats {
    connectedAt?: number;
    disconnectedAt?: number;
    reconnectAttempts: number;
    lastReconnectAt?: number;
}

class SocketClient {
    private socket: Socket | null = null;
    private stats: ConnectionStats = {
        reconnectAttempts: 0,
    };

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
                reconnectionDelayMax: 5000,
                reconnectionAttempts: Infinity,
                timeout: 20000,
                transports: ['websocket', 'polling'],
            });

            this.socket.on("connect", () => {
                logger.log("✅ [SOCKET] Connected to chat server at", SOCKET_URL);
                logger.log("✅ [SOCKET] Socket ID:", this.socket?.id);

                this.stats.connectedAt = Date.now();
                this.stats.reconnectAttempts = 0;
            });

            this.socket.on("disconnect", (reason: string) => {
                logger.log("❌ [SOCKET] Disconnected from chat server:", reason);

                this.stats.disconnectedAt = Date.now();

                if (reason === "io server disconnect") {
                    // Server disconnected this client, try to reconnect
                    logger.warn("⚠️ [SOCKET] Server disconnected, will try to reconnect...");
                    this.socket?.connect();
                }
            });

            this.socket.on("connect_error", (error: Error) => {
                this.stats.reconnectAttempts++;
                this.stats.lastReconnectAt = Date.now();

                logger.warn("⚠️ [SOCKET] Connection error:", error.message);
                logger.warn(`⚠️ [SOCKET] Reconnect attempt ${this.stats.reconnectAttempts}`);
                logger.warn("⚠️ [SOCKET] Make sure chat server is running at:", SOCKET_URL);
            });

            this.socket.on("reconnect_attempt", (attempt: number) => {
                logger.log(`🔄 [SOCKET] Reconnection attempt ${attempt}...`);
            });

            this.socket.on("reconnect", (attempt: number) => {
                logger.log(`✅ [SOCKET] Reconnected after ${attempt} attempts`);
            });

            this.socket.on("reconnect_failed", () => {
                logger.error("❌ [SOCKET] Reconnection failed");
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
            this.stats = { reconnectAttempts: 0 };
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    getStats(): ConnectionStats {
        return { ...this.stats };
    }

    getConnectionQuality(): "excellent" | "good" | "poor" | "disconnected" {
        if (!this.socket?.connected) {
            return "disconnected";
        }

        if (this.stats.reconnectAttempts === 0) {
            return "excellent";
        }

        if (this.stats.reconnectAttempts < 3) {
            return "good";
        }

        return "poor";
    }
}

export const socketClient = new SocketClient();
