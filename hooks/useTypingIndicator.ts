import { useCallback, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface UseTypingIndicatorOptions {
    socket: Socket | null;
    recipientId: string;
    throttleMs?: number;
    autoStopMs?: number;
}

/**
 * Custom hook for managing typing indicators with throttling
 * Prevents spam by throttling emission and auto-clearing after timeout
 */
export function useTypingIndicator({
    socket,
    recipientId,
    throttleMs = 500,
    autoStopMs = 5000,
}: UseTypingIndicatorOptions) {
    const lastEmitTime = useRef<number>(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const isTypingRef = useRef<boolean>(false);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const emitTyping = useCallback(
        (isTyping: boolean) => {
            if (!socket?.connected || !recipientId) {
                return;
            }

            const now = Date.now();
            const timeSinceLastEmit = now - lastEmitTime.current;

            // Throttle emissions - skip if called too soon
            if (isTyping && timeSinceLastEmit < throttleMs) {
                return;
            }

            // Update last emit time
            lastEmitTime.current = now;
            isTypingRef.current = isTyping;

            // Emit typing status
            socket.emit("typing", { recipientId, isTyping });

            // If typing, set timeout to automatically stop
            if (isTyping) {
                // Clear existing timeout
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                // Set new timeout to auto-stop typing
                timeoutRef.current = setTimeout(() => {
                    if (isTypingRef.current) {
                        socket.emit("typing", { recipientId, isTyping: false });
                        isTypingRef.current = false;
                    }
                }, autoStopMs);
            } else {
                // Clear timeout when explicitly stopped
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            }
        },
        [socket, recipientId, throttleMs, autoStopMs]
    );

    const startTyping = useCallback(() => {
        emitTyping(true);
    }, [emitTyping]);

    const stopTyping = useCallback(() => {
        emitTyping(false);
    }, [emitTyping]);

    return { startTyping, stopTyping };
}
