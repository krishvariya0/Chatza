import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Chat from "@/models/Chat";
import Follow from "@/models/Follow";
import Message from "@/models/Message";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface MessageQuery {
    chatId: string;
    createdAt?: { $lt: Date };
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const { chatId } = await params;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "50");
        const before = searchParams.get("before");

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });
        }

        const isParticipant = chat.participants.some(
            (p: Types.ObjectId) => p.toString() === user._id.toString()
        );

        if (!isParticipant) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        const query: MessageQuery = { chatId };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("senderId", "username fullName profilePicture")
            .lean();

        return NextResponse.json({
            success: true,
            messages: messages.reverse(),
            hasMore: messages.length === limit,
        });
    } catch (error) {
        console.error("Get messages error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const { chatId } = await params;
        const body = await request.json();
        const { text, recipientId, replyTo } = body;

        if (!text?.trim()) {
            return NextResponse.json({ success: false, error: "Message text required" }, { status: 400 });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });
        }

        const isParticipant = chat.participants.some(
            (p: Types.ObjectId) => p.toString() === user._id.toString()
        );

        if (!isParticipant) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        if (recipientId) {
            const iFollow = await Follow.findOne({ follower: user._id, following: recipientId });
            const theyFollow = await Follow.findOne({ follower: recipientId, following: user._id });

            // Note: Keeping mutual check as per existing
            if (!iFollow || !theyFollow) {
                return NextResponse.json({
                    success: false,
                    error: "You can only message mutual followers"
                }, { status: 403 });
            }
        }

        let normalizedReplyTo = undefined;

        if (replyTo !== undefined) {
            if (!replyTo || typeof replyTo !== "object") {
                return NextResponse.json({ success: false, error: "Invalid replyTo" }, { status: 400 });
            }

            const { messageId } = replyTo;

            if (!messageId || typeof messageId !== "string" || !Types.ObjectId.isValid(messageId)) {
                return NextResponse.json({ success: false, error: "Invalid replyTo.messageId" }, { status: 400 });
            }

            const repliedMessage = await Message.findById(messageId).populate("senderId", "username");

            if (!repliedMessage) {
                return NextResponse.json({ success: false, error: "Replied message not found" }, { status: 400 });
            }

            if (repliedMessage.chatId.toString() !== chatId) {
                return NextResponse.json({ success: false, error: "Invalid replyTo" }, { status: 400 });
            }

            const repliedSender = repliedMessage.senderId as { _id?: { toString(): string }, username?: string } | string;
            const repliedSenderId = typeof repliedSender === 'object' && repliedSender?._id?.toString?.() || (typeof repliedSender === 'string' ? repliedSender : "");
            const repliedSenderName = typeof repliedSender === 'object' && typeof repliedSender?.username === "string" ? repliedSender.username : "";

            normalizedReplyTo = {
                messageId,
                text: typeof repliedMessage.text === "string" ? repliedMessage.text : "",
                senderId: repliedSenderId,
                senderName: repliedSenderName,
            };
        }

        const message = await Message.create({
            chatId,
            senderId: user._id,
            text: text.trim(),
            seen: false,
            replyTo: normalizedReplyTo
        });

        if (normalizedReplyTo) {
            await Message.updateOne(
                { _id: message._id },
                { $set: { replyTo: normalizedReplyTo } },
                { strict: false }
            );
            message.replyTo = normalizedReplyTo;
        }

        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: text.trim(),
            lastMessageAt: new Date(),
        });

        await message.populate("senderId", "username fullName profilePicture");

        return NextResponse.json({
            success: true,
            message: message.toObject(),
        });
    } catch (error) {
        console.error("Send message error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send message" },
            { status: 500 }
        );
    }
}
