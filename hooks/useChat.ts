import { logger } from "@/utils/logger";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

interface Message {
    _id: string;
    chatId: string;
    senderId: {
        _id: string;
        username: string;
        fullName: string;
        profilePicture?: string;
    };
    text: string;
    seen: boolean;
    seenAt?: string;
    edited?: boolean;
    editedAt?: string;
    deleted?: boolean;
    deletedAt?: string;
    delivered?: boolean;
    deliveredAt?: string;
    createdAt: string;
    clientTempId?: string; // For de-duplication
    replyTo?: {
        messageId: string;
        text: string;
        senderId: string;
        senderName: string;
    };
}

interface CurrentUser {
    id: string;
    username: string;
    fullName: string;
    profilePicture?: string;
}

interface UseChatProps {
    socket: Socket | null;

    recipientId: string;
    currentUserId?: string;
}

interface JoinChatResponse {
    success: boolean;
    chatId?: string;
    roomId?: string;
    messages?: Message[];
    error?: string;
}

interface SendMessageResponse {
    success: boolean;
    message?: Message;
    error?: string;
}

export function useChat({ socket, recipientId, currentUserId: currentUserIdProp }: UseChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesRef = useRef<Message[]>([]);
    const [chatId, setChatId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const initialized = useRef(false);
    const currentRecipientRef = useRef<string | null>(null);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const initiateReply = useCallback((message: Message) => {
        setReplyingTo(message);
    }, []);

    const cancelReply = useCallback(() => {
        setReplyingTo(null);
    }, []);

    // Use prop if available, otherwise fetch internal (backward compatibility)
    useEffect(() => {
        if (currentUserIdProp) {
            setCurrentUserId(currentUserIdProp);
            // We can't set full currentUser without fetching, but ID is enough for most ops
        } else {
            const fetchCurrentUser = async () => {
                try {
                    const res = await fetch("/api/auth/me");
                    const data = await res.json();
                    if (res.ok && data.user) {
                        setCurrentUserId(data.user.id);
                        setCurrentUser(data.user);
                    }
                } catch (err) {
                    logger.error("Failed to get current user:", err);
                }
            };
            fetchCurrentUser();
        }
    }, [currentUserIdProp]);

    // Fallback REST API initialization (OPTIMIZED)
    const initializeChatViaREST = useCallback(async () => {
        try {
            logger.log("🔄 [CHAT] Initializing via REST API fallback...");

            // Step 1: Create or find chat
            const createRes = await fetch("/api/chats/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipientId }),
            });
            const createData = await createRes.json();

            if (!createRes.ok || !createData.success) {
                logger.error("❌ [CHAT] Failed to create chat:", createData.error);
                setError(createData.error || "Failed to start chat");
                setLoading(false);
                initialized.current = false; // Reset to allow retry
                return;
            }

            const chatData = createData.chat;
            const chatIdValue = chatData._id;

            // Set chat ID immediately (don't wait for messages)
            setChatId(chatIdValue);
            logger.log("✅ [CHAT] Chat ID from REST:", chatIdValue);

            // Step 2: Fetch messages and join socket room in PARALLEL (non-blocking)
            const messagesFetch = fetch(`/api/chats/${chatIdValue}/messages`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setMessages(data.messages || []);
                        logger.log("✅ [CHAT] Loaded messages via REST:", data.messages?.length || 0);
                    }
                })
                .catch(err => logger.warn("⚠️ [CHAT] Failed to fetch messages:", err));

            // Join socket room in background (don't wait for it)
            if (socket?.connected) {
                logger.log("🔄 [CHAT] Joining socket room for real-time updates...");
                socket.emit("join_chat", { recipientId }, (response: JoinChatResponse) => {
                    if (response?.success) {
                        logger.log("✅ [CHAT] Real-time updates enabled");
                    }
                });
            }

            // Wait for messages to load before hiding loading state
            await messagesFetch;
            setLoading(false);

        } catch (err) {
            logger.error("❌ [CHAT] REST API fallback failed:", err);
            setError("Failed to connect. Please try again.");
            setLoading(false);
            initialized.current = false; // Reset to allow retry
        }
    }, [recipientId, socket]);

    const initializeChat = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            logger.log("🔵 [CHAT] Initializing chat with recipient:", recipientId);
            logger.log("🔵 [CHAT] Socket connected?", socket?.connected);

            if (!socket || !socket.connected) {
                logger.warn("⚠️ [CHAT] Socket not connected, falling back to REST API");
                // Fallback to REST API if socket not available
                await initializeChatViaREST();
                return;
            }

            // Set timeout to prevent infinite loading (very aggressive)
            const timeoutId = setTimeout(() => {
                logger.warn("⏱️ [CHAT] Socket join_chat timeout, falling back to REST API");
                initializeChatViaREST();
            }, 1500); // 1.5 second timeout for instant fallback

            // Step 1: Join chat room via socket
            logger.log("🔵 [CHAT] Emitting join_chat event...");
            socket.emit("join_chat", { recipientId }, (response: JoinChatResponse) => {
                clearTimeout(timeoutId); // Clear timeout on response

                logger.log("🔵 [CHAT] join_chat response:", response);

                if (!response || !response.success) {
                    logger.warn("⚠️ [CHAT] Failed to join chat via socket:", response?.error);
                    // Fallback to REST API
                    initializeChatViaREST();
                    return;
                }

                const { chatId: socketChatId, roomId, messages: socketMessages } = response;
                logger.log("✅ [CHAT] Joined room:", roomId);
                logger.log("✅ [CHAT] Chat ID:", socketChatId);
                logger.log("✅ [CHAT] Loaded messages:", socketMessages?.length || 0);

                setChatId(socketChatId || null);
                if (socketMessages && Array.isArray(socketMessages)) {
                    setMessages(socketMessages);
                }
                setLoading(false);
            });
        } catch (err) {
            logger.error("❌ [CHAT] Failed to initialize chat:", err);
            // Fallback to REST API
            await initializeChatViaREST();
        }
    }, [recipientId, socket, initializeChatViaREST]);

    // Initialize chat when recipientId or socket changes
    useEffect(() => {
        if (!recipientId) {
            setLoading(false);
            setMessages([]);
            setChatId(null);
            initialized.current = false;
            currentRecipientRef.current = null;
            return;
        }

        // Reset if recipient changed
        if (currentRecipientRef.current !== recipientId) {
            logger.log("🔄 [CHAT] Recipient changed, resetting chat state");
            setMessages([]);
            setChatId(null);
            initialized.current = false;
            currentRecipientRef.current = recipientId;
        }

        let quickFallbackTimeout: NodeJS.Timeout | undefined;

        if (socket?.connected) {
            // Socket is ready - initialize IMMEDIATELY (no delay)
            if (!initialized.current && currentRecipientRef.current === recipientId) {
                initialized.current = true;
                logger.log("⚡ [CHAT] Socket ready - initializing instantly!");
                initializeChat();
            }
        } else {
            // Socket not connected - wait minimal time then use REST
            quickFallbackTimeout = setTimeout(() => {
                if (!initialized.current && currentRecipientRef.current === recipientId) {
                    initialized.current = true;
                    logger.log("⚡ [CHAT] Using REST API (socket not ready)");
                    initializeChat();
                }
            }, 100); // Only 100ms wait before REST fallback
        }

        return () => {
            if (quickFallbackTimeout) {
                clearTimeout(quickFallbackTimeout);
            }
            // Only reset if recipient actually changed
            if (currentRecipientRef.current !== recipientId) {
                initialized.current = false;
            }
        };
    }, [recipientId, socket?.connected, initializeChat]);

    // Cleanup active chat on unmount or change
    useEffect(() => {
        const currentChatId = chatId;

        return () => {
            if (currentChatId && socket?.connected) {
                logger.log("👋 [CHAT] Leaving chat (cleanup):", currentChatId);
                socket.emit("leave_chat", { chatId: currentChatId });
            }
        };
    }, [chatId, socket]);

    // Send message via REST API (fallback)
    const sendMessageViaREST = async (text: string, tempId: string, replyTo?: Message["replyTo"], callback?: (success: boolean) => void) => {
        try {
            logger.log("🔄 [SEND] Sending message via REST API fallback...");

            const res = await fetch(`/api/chats/${chatId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, recipientId, replyTo }),
            });
            const data = await res.json();

            if (res.ok && data.success && data.message) {
                // Replace temp message with real one from server
                setMessages(prev =>
                    prev.map(m => {
                        if (m._id !== tempId) return m;
                        const serverMessage: Message = data.message;
                        return {
                            ...serverMessage,
                            clientTempId: m.clientTempId,
                            replyTo: serverMessage.replyTo ?? m.replyTo,
                        };
                    })
                );
                logger.log("✅ [SEND] Message sent via REST API");
                callback?.(true);
            } else {
                // Remove temp message on failure
                setMessages(prev => prev.filter(m => m._id !== tempId));
                logger.error("❌ [SEND] REST API send failed:", data.error);
                callback?.(false);
            }
        } catch (err) {
            // Remove temp message on error
            setMessages(prev => prev.filter(m => m._id !== tempId));
            logger.error("❌ [SEND] REST API send error:", err);
            callback?.(false);
        }
    };

    // Send message function
    const sendMessage = useCallback(
        async (text: string, callback?: (success: boolean) => void) => {
            const trimmedText = text.trim();

            if (!chatId || !trimmedText || !currentUserId) {
                logger.log("❌ [SEND] Cannot send: missing chatId, text, or currentUserId", { chatId, trimmedText, currentUserId });
                callback?.(false);
                return;
            }

            let replyData: Message["replyTo"] | undefined;

            if (replyingTo) {
                let resolvedReplyMessageId = replyingTo._id;

                if (resolvedReplyMessageId.startsWith("temp_")) {
                    const resolved = messagesRef.current.find(
                        m => m.clientTempId === resolvedReplyMessageId && !m._id.startsWith("temp_")
                    );

                    if (resolved) {
                        resolvedReplyMessageId = resolved._id;
                    } else {
                        logger.warn("⚠️ [SEND] Cannot reply to optimistic message yet (waiting for server id)");
                        callback?.(false);
                        return;
                    }
                }

                replyData = {
                    messageId: resolvedReplyMessageId,
                    text: replyingTo.text,
                    senderId: replyingTo.senderId._id,
                    senderName: replyingTo.senderId.username
                };
            }

            // Create optimistic message for instant display
            const tempId = `temp_${Date.now()}_${Math.random()}`;
            const newMessage: Message = {
                _id: tempId,
                chatId,
                senderId: {
                    _id: currentUserId,
                    username: currentUser?.username || "",
                    fullName: currentUser?.fullName || "",
                    profilePicture: currentUser?.profilePicture,
                },
                text: trimmedText,
                seen: false,
                createdAt: new Date().toISOString(),
                clientTempId: tempId, // Store temp ID locally
                replyTo: replyData
            };

            // Add to messages immediately (optimistic update)
            setMessages(prev => [...prev, newMessage]);
            setReplyingTo(null); // Clear reply state immediately

            // Try socket first, fallback to REST API
            if (socket?.connected) {
                logger.log("📤 [SEND] Sending message via socket:", { chatId, recipientId, text: trimmedText, replyTo: replyData });

                try {
                    // Set timeout for socket response
                    const timeoutId = setTimeout(() => {
                        logger.warn("⏱️ [SEND] Socket send timeout, falling back to REST API");
                        sendMessageViaREST(trimmedText, tempId, replyData, callback);
                    }, 5000); // 5 second timeout

                    // Send via socket
                    socket.emit("send_message", {
                        chatId,
                        recipientId,
                        text: trimmedText,
                        clientTempId: tempId, // Send temp ID for de-duplication
                        replyTo: replyData
                    }, (response: SendMessageResponse) => {
                        clearTimeout(timeoutId); // Clear timeout on response

                        logger.log("📥 [SEND] Server response:", response);

                        if (response && response.success && response.message) {
                            // Replace temp message with real one from server
                            const serverMessage = response.message;
                            setMessages(prev =>
                                prev.map(m => {
                                    if (m._id !== tempId) return m;
                                    return {
                                        ...serverMessage,
                                        clientTempId: m.clientTempId,
                                        replyTo: serverMessage.replyTo ?? m.replyTo,
                                    };
                                })
                            );
                            logger.log("✅ [SEND] Message sent successfully via socket");
                            callback?.(true);
                        } else {
                            // Fallback to REST API on socket failure
                            logger.warn("⚠️ [SEND] Socket send failed, falling back to REST API");
                            sendMessageViaREST(trimmedText, tempId, replyData, callback);
                        }
                    });
                } catch (err) {
                    logger.error("❌ [SEND] Socket send error:", err);
                    // Fallback to REST API
                    sendMessageViaREST(trimmedText, tempId, replyData, callback);
                }
            } else {
                logger.warn("⚠️ [SEND] Socket not connected, using REST API");
                // Use REST API directly
                sendMessageViaREST(trimmedText, tempId, replyData, callback);
            }
        },
        [chatId, recipientId, currentUserId, currentUser, socket, replyingTo]
    );

    // Socket event listeners (for real-time updates from other users)
    useEffect(() => {
        if (!chatId) {
            logger.log("⏸️ [LISTENERS] Not setting up listeners - chatId missing");
            return;
        }

        // Set up listeners even if socket not connected yet (will work when it connects)
        if (!socket) {
            logger.log("⏳ [LISTENERS] Socket not available yet, will set up when connected");
            return;
        }

        logger.log("👂 [LISTENERS] Setting up socket listeners for chat:", chatId);
        logger.log("👂 [LISTENERS] Socket connected?", socket.connected);

        const handleReceiveMessage = (data: { message: Message; chatId: string; clientTempId?: string }) => {
            logger.log("📨 [LISTENERS] Received message event:", data);
            logger.log("📨 [LISTENERS] Message chatId:", data.chatId, "Current chatId:", chatId);

            // Accept message if it matches current chat
            if (data.chatId === chatId) {
                setMessages(prev => {
                    // Check if message already exists by _id
                    if (prev.some(m => m._id === data.message._id)) {
                        logger.log("⚠️ [LISTENERS] Duplicate message (by _id), skipping");
                        return prev;
                    }

                    // Check if message matches an optimistic update (by clientTempId)
                    if (data.clientTempId) {
                        const existingOptimistic = prev.findIndex(m => m.clientTempId === data.clientTempId);
                        if (existingOptimistic !== -1) {
                            logger.log("✅ [LISTENERS] Replaced optimistic message with server message");
                            // Replace the optimistic message with the server message
                            const newMessages = [...prev];
                            const optimistic = newMessages[existingOptimistic];
                            const serverMessage = data.message;
                            newMessages[existingOptimistic] = {
                                ...serverMessage,
                                clientTempId: optimistic.clientTempId,
                                replyTo: serverMessage.replyTo ?? optimistic.replyTo,
                            };
                            return newMessages;
                        }
                    }

                    logger.log("✅ [LISTENERS] Adding new message, total messages:", prev.length + 1);
                    // Sort by creation time
                    const updated = [...prev, data.message].sort((a, b) =>
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    );
                    return updated;
                });
            } else {
                logger.log("⏭️ [LISTENERS] Ignoring message - wrong chat");
            }
        };

        const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
            logger.log("⌨️ [LISTENERS] Typing event:", data);
            if (data.userId === recipientId) {
                setIsTyping(data.isTyping);
            }
        };

        const handleMessageEdited = (data: { messageId: string; newText: string; edited: boolean; editedAt: Date | string }) => {
            logger.log("📝 [LISTENERS] Message edited event:", data);
            setMessages(prev =>
                prev.map(m =>
                    m._id === data.messageId
                        ? {
                            ...m,
                            text: data.newText,
                            edited: data.edited,
                            editedAt: typeof data.editedAt === "string" ? data.editedAt : data.editedAt?.toString(),
                        }
                        : m
                )
            );
        };

        const handleMessageDeleted = (data: { messageId: string; deleted: boolean }) => {
            logger.log("🗑️ [LISTENERS] Message deleted event:", data);
            setMessages(prev =>
                prev.map(m =>
                    m._id === data.messageId
                        ? { ...m, deleted: true, text: "This message was deleted" }
                        : m.replyTo?.messageId === data.messageId
                            ? {
                                ...m,
                                replyTo: {
                                    ...m.replyTo,
                                    text: "This message was deleted",
                                },
                            }
                            : m
                )
            );
        };

        const handleMessageSeenUpdate = (data: { chatId: string; seenBy?: string; seenAt?: Date }) => {
            logger.log("👁️ [LISTENERS] Message seen update:", data);

            // If the update isn't for this chat, ignore it (unless we want to update chat list indicators too)
            if (data.chatId !== chatId) return;

            setMessages(prev => prev.map(msg => {
                // If message is ours and not yet seen, mark it seen
                // OR if we are the receiver and just marked it seen (though usually that happens on load)
                if (!msg.seen) {
                    return { ...msg, seen: true, seenAt: data.seenAt?.toString() || new Date().toISOString() };
                }
                return msg;
            }));
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("user_typing", handleUserTyping);
        socket.on("message_edited", handleMessageEdited);
        socket.on("message_deleted", handleMessageDeleted);
        socket.on("message_seen_update", handleMessageSeenUpdate);

        logger.log("✅ [LISTENERS] Listeners registered");

        return () => {
            if (socket) {
                socket.off("receive_message", handleReceiveMessage);
                socket.off("user_typing", handleUserTyping);
                socket.off("message_edited", handleMessageEdited);
                socket.off("message_deleted", handleMessageDeleted);
                socket.off("message_seen_update", handleMessageSeenUpdate);
            }
        };
    }, [socket, chatId, recipientId, currentUserId]);

    // Polling fallback for real-time updates when socket is not available
    useEffect(() => {
        if (!chatId) return;

        // Only poll if socket is not connected
        if (socket?.connected) {
            logger.log("✅ [POLL] Socket connected, polling disabled");
            return;
        }

        logger.log("🔄 [POLL] Starting polling for new messages (socket not connected)");

        let pollInterval: ReturnType<typeof setInterval> | null = null;

        const startPolling = () => {
            if (pollInterval) return; // Already polling

            pollInterval = setInterval(async () => {
                // Only poll if tab is visible
                if (document.hidden) {
                    return;
                }

                try {
                    const res = await fetch(`/api/chats/${chatId}/messages`);
                    const data = await res.json();

                    if (res.ok && data.success && Array.isArray(data.messages)) {
                        setMessages(prev => {
                            // Merge new messages
                            const existingIds = new Set(prev.map(m => m._id));
                            const newMessages = data.messages.filter((m: Message) => !existingIds.has(m._id));

                            if (newMessages.length > 0) {
                                logger.log("🔄 [POLL] Found", newMessages.length, "new messages via polling");
                                // Sort by creation time
                                return [...prev, ...newMessages].sort((a, b) =>
                                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                                );
                            }
                            return prev;
                        });
                    }
                } catch (err) {
                    logger.warn("⚠️ [POLL] Polling error:", err);
                }
            }, 2000); // Poll every 2 seconds
        };

        const stopPolling = () => {
            if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
            }
        };

        // Handle visibility change
        const handleVisibilityChange = () => {
            if (document.hidden) {
                logger.log("👁️ [POLL] Tab hidden, pausing polling");
                stopPolling();
            } else {
                logger.log("👁️ [POLL] Tab visible, resuming polling");
                startPolling();
            }
        };

        // Listen for visibility changes
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Start polling if tab is visible
        if (!document.hidden) {
            startPolling();
        }

        return () => {
            logger.log("🛑 [POLL] Stopping polling");
            stopPolling();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [chatId, socket?.connected]);

    const markAsSeen = useCallback(async () => {
        if (!chatId) {
            logger.warn("⚠️ [SEEN] No chatId, cannot mark as seen");
            return;
        }

        logger.log("👁️ [SEEN] Attempting to mark messages as seen for chat:", chatId);
        logger.log("👁️ [SEEN] Socket connected?", socket?.connected);

        // Try socket first
        if (socket?.connected) {
            logger.log("👁️ [SEEN] Using Socket.IO to mark as seen");
            socket.emit("mark_as_seen", { chatId }, (response: { success?: boolean; error?: string }) => {
                if (response?.success) {
                    logger.log("✅ [SEEN] Messages marked as seen via socket");
                    // Update local state to reflect seen status
                    setMessages(prev =>
                        prev.map(m => ({
                            ...m,
                            seen: m.senderId._id !== currentUserId ? true : m.seen,
                        }))
                    );
                } else {
                    logger.warn("⚠️ [SEEN] Socket failed, falling back to REST API:", response?.error);
                    // Fallback to REST API
                    markAsSeenViaREST();
                }
            });
        } else {
            // Use REST API if socket not connected
            logger.warn("⚠️ [SEEN] Socket not connected, using REST API");
            await markAsSeenViaREST();
        }

        async function markAsSeenViaREST() {
            try {
                logger.log("🔄 [SEEN] Marking as seen via REST API...");
                const res = await fetch(`/api/chats/${chatId}/messages/mark-seen`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    logger.log("✅ [SEEN] Messages marked as seen via REST API");
                    // Update local state
                    setMessages(prev =>
                        prev.map(m => ({
                            ...m,
                            seen: m.senderId._id !== currentUserId ? true : m.seen,
                        }))
                    );
                } else {
                    logger.error("❌ [SEEN] REST API failed:", data.error);
                }
            } catch (error) {
                logger.error("❌ [SEEN] REST API error:", error);
            }
        }
    }, [chatId, socket, currentUserId]);

    const sendTyping = useCallback((typing: boolean) => {
        if (socket?.connected) {
            socket.emit("typing", { recipientId, isTyping: typing });
        }
    }, [socket, recipientId]);

    const editMessage = useCallback(
        async (messageId: string, newText: string, recipientId: string) => {
            if (!messageId || !newText?.trim() || !chatId) {
                logger.error("❌ [EDIT] Invalid edit data");
                return;
            }

            const trimmedText = newText.trim();

            // Optimistic update
            setMessages(prev =>
                prev.map(m =>
                    m._id === messageId
                        ? { ...m, text: trimmedText, edited: true }
                        : m
                )
            );

            if (socket?.connected) {
                logger.log("📝 [EDIT] Editing message via socket:", messageId);
                socket.emit(
                    "edit_message",
                    { messageId, newText: trimmedText, recipientId },
                    (response: { success?: boolean; message?: Message; error?: string }) => {
                        if (response?.success && response.message) {
                            logger.log("✅ [EDIT] Message edited successfully");
                            // Replace with server response
                            const updatedMessage = response.message;
                            setMessages(prev =>
                                prev.map(m => (m._id === messageId ? updatedMessage : m))
                            );
                        } else {
                            logger.error("❌ [EDIT] Edit failed:", response?.error);
                            // Revert optimistic update
                            setMessages(prev =>
                                prev.map(m => {
                                    if (m._id === messageId) {
                                        // Find original message or keep current
                                        return m;
                                    }
                                    return m;
                                })
                            );
                        }
                    }
                );
            } else {
                // Fallback to REST API
                logger.log("📝 [EDIT] Editing message via REST API");
                try {
                    const res = await fetch(`/api/chats/${chatId}/messages/${messageId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: trimmedText }),
                    });
                    const data = await res.json();

                    if (res.ok && data.success && data.message) {
                        logger.log("✅ [EDIT] Message edited via REST API");
                        setMessages(prev =>
                            prev.map(m => (m._id === messageId ? data.message : m))
                        );
                    } else {
                        logger.error("❌ [EDIT] REST API edit failed:", data.error);
                        // Revert optimistic update - reload messages
                        try {
                            const messagesRes = await fetch(`/api/chats/${chatId}/messages`);
                            const messagesData = await messagesRes.json();
                            if (messagesRes.ok && messagesData.success) {
                                setMessages(messagesData.messages || []);
                            }
                        } catch (reloadErr) {
                            logger.error("❌ [EDIT] Failed to reload messages:", reloadErr);
                        }
                    }
                } catch (err) {
                    logger.error("❌ [EDIT] REST API error:", err);
                    // Revert optimistic update
                    try {
                        const messagesRes = await fetch(`/api/chats/${chatId}/messages`);
                        const messagesData = await messagesRes.json();
                        if (messagesRes.ok && messagesData.success) {
                            setMessages(messagesData.messages || []);
                        }
                    } catch (reloadErr) {
                        logger.error("❌ [EDIT] Failed to reload messages:", reloadErr);
                    }
                }
            }
        },
        [chatId, socket, recipientId]
    );

    const deleteMessage = useCallback(
        async (messageId: string, recipientId: string) => {
            if (!messageId || !chatId) {
                logger.error("❌ [DELETE] Invalid delete data");
                return;
            }

            // Optimistic update
            setMessages(prev =>
                prev.map(m =>
                    m._id === messageId
                        ? {
                            ...m,
                            deleted: true,
                            text: "This message was deleted",
                        }
                        : m.replyTo?.messageId === messageId
                            ? {
                                ...m,
                                replyTo: {
                                    ...m.replyTo,
                                    text: "This message was deleted",
                                },
                            }
                            : m
                )
            );

            if (socket?.connected) {
                logger.log("🗑️ [DELETE] Deleting message via socket:", messageId);
                socket.emit(
                    "delete_message",
                    { messageId, recipientId },
                    async (response: { success?: boolean; error?: string }) => {
                        if (response?.success) {
                            logger.log("✅ [DELETE] Message deleted successfully");
                            // Update local state
                            setMessages(prev =>
                                prev.map(m =>
                                    m._id === messageId
                                        ? {
                                            ...m,
                                            deleted: true,
                                            text: "This message was deleted",
                                        }
                                        : m.replyTo?.messageId === messageId
                                            ? {
                                                ...m,
                                                replyTo: {
                                                    ...m.replyTo,
                                                    text: "This message was deleted",
                                                },
                                            }
                                            : m
                                )
                            );
                        } else {
                            logger.error("❌ [DELETE] Delete failed:", response?.error);
                            // Revert optimistic update
                            try {
                                const messagesRes = await fetch(`/api/chats/${chatId}/messages`);
                                const messagesData = await messagesRes.json();
                                if (messagesRes.ok && messagesData.success) {
                                    setMessages(messagesData.messages || []);
                                }
                            } catch (reloadErr) {
                                logger.error("❌ [DELETE] Failed to reload messages:", reloadErr);
                            }
                        }
                    }
                );
            } else {
                // Fallback to REST API
                logger.log("🗑️ [DELETE] Deleting message via REST API");
                try {
                    const res = await fetch(`/api/chats/${chatId}/messages/${messageId}`, {
                        method: "DELETE",
                    });
                    const data = await res.json();

                    if (res.ok && data.success) {
                        logger.log("✅ [DELETE] Message deleted via REST API");
                        setMessages(prev =>
                            prev.map(m =>
                                m._id === messageId
                                    ? {
                                        ...m,
                                        deleted: true,
                                        text: "This message was deleted",
                                    }
                                    : m.replyTo?.messageId === messageId
                                        ? {
                                            ...m,
                                            replyTo: {
                                                ...m.replyTo,
                                                text: "This message was deleted",
                                            },
                                        }
                                        : m
                            )
                        );
                    } else {
                        logger.error("❌ [DELETE] REST API delete failed:", data.error);
                        // Revert optimistic update
                        const messagesRes = await fetch(`/api/chats/${chatId}/messages`);
                        const messagesData = await messagesRes.json();
                        if (messagesRes.ok && messagesData.success) {
                            setMessages(messagesData.messages || []);
                        }
                    }
                } catch (err) {
                    logger.error("❌ [DELETE] REST API error:", err);
                }
            }
        },
        [chatId, socket, recipientId]
    );

    return {
        messages,
        chatId,
        isTyping,
        loading,
        error,
        currentUserId,
        sendMessage,
        editMessage,
        deleteMessage,
        markAsSeen,
        sendTyping,
        replyingTo,
        initiateReply,
        cancelReply,
    };
}
