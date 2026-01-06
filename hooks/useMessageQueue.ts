import { logger } from "@/utils/logger";
import { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface QueuedMessage {
    tempId: string;
    chatId: string;
    recipientId: string;
    text: string;
    timestamp: number;
}

const QUEUE_STORAGE_KEY = "chatza_message_queue";
const MAX_QUEUE_SIZE = 50;

/**
 * Custom hook for client-side message queue management
 * Handles offline message queuing with localStorage persistence
 */
export function useMessageQueue(socket: Socket | null, isConnected: boolean) {
    const [queue, setQueue] = useState<QueuedMessage[]>([]);
    const [isFlushing, setIsFlushing] = useState(false);

    // Load queue from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setQueue(parsed);
                logger.log(`📥 [QUEUE] Loaded ${parsed.length} queued messages from storage`);
            }
        } catch (err) {
            logger.error("Failed to load message queue:", err);
        }
    }, []);

    // Save queue to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
        } catch (err) {
            logger.error("Failed to save message queue:", err);
        }
    }, [queue]);

    // Add message to queue
    const enqueue = useCallback((message: Omit<QueuedMessage, "timestamp">) => {
        setQueue((prev) => {
            // Check for duplicates
            if (prev.some((m) => m.tempId === message.tempId)) {
                logger.warn(`⚠️ [QUEUE] Duplicate message prevented: ${message.tempId}`);
                return prev;
            }

            // Check queue size limit
            if (prev.length >= MAX_QUEUE_SIZE) {
                logger.warn(`⚠️ [QUEUE] Queue full, removing oldest message`);
                prev.shift(); // Remove oldest
            }

            const newMessage = { ...message, timestamp: Date.now() };
            logger.log(`📥 [QUEUE] Added message to queue (size: ${prev.length + 1})`);
            return [...prev, newMessage];
        });
    }, []);

    // Remove message from queue
    const dequeue = useCallback((tempId: string) => {
        setQueue((prev) => {
            const filtered = prev.filter((m) => m.tempId !== tempId);
            if (filtered.length < prev.length) {
                logger.log(`📤 [QUEUE] Removed message from queue (size: ${filtered.length})`);
            }
            return filtered;
        });
    }, []);

    // Clear entire queue
    const clearQueue = useCallback(() => {
        setQueue([]);
        localStorage.removeItem(QUEUE_STORAGE_KEY);
        logger.log(`🧹 [QUEUE] Cleared message queue`);
    }, []);

    // Flush queue when connection is restored
    const flushQueue = useCallback(
        async (sendMessageFn: (message: QueuedMessage) => Promise<boolean>) => {
            if (queue.length === 0 || isFlushing) {
                return;
            }

            logger.log(`📤 [QUEUE] Flushing ${queue.length} queued messages...`);
            setIsFlushing(true);

            const toSend = [...queue];
            const failed: QueuedMessage[] = [];

            for (const message of toSend) {
                try {
                    const success = await sendMessageFn(message);
                    if (success) {
                        dequeue(message.tempId);
                    } else {
                        failed.push(message);
                    }
                    // Small delay between sends to avoid spam
                    await new Promise((resolve) => setTimeout(resolve, 100));
                } catch (err) {
                    logger.error(`Failed to send queued message:`, err);
                    failed.push(message);
                }
            }

            setIsFlushing(false);

            if (failed.length > 0) {
                logger.warn(`⚠️ [QUEUE] ${failed.length} messages failed to send`);
            } else {
                logger.log(`✅ [QUEUE] All queued messages sent successfully`);
                clearQueue();
            }
        },
        [queue, isFlushing, dequeue, clearQueue]
    );

    // Auto-flush when socket reconnects
    useEffect(() => {
        if (isConnected && socket && queue.length > 0 && !isFlushing) {
            logger.log(`🔄 [QUEUE] Connection restored, preparing to flush queue...`);
            // Don't auto-flush here - let the parent component handle it with proper sendMessage function
        }
    }, [isConnected, socket, queue.length, isFlushing]);

    return {
        queue,
        queueSize: queue.length,
        enqueue,
        dequeue,
        clearQueue,
        flushQueue,
        isFlushing,
    };
}
