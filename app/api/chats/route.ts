import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

interface Participant {
    _id: Types.ObjectId;
    username: string;
    fullName: string;
    profilePicture?: string;
}

interface ChatDoc {
    _id: Types.ObjectId;
    participants: Participant[];
    lastMessage?: string;
    lastMessageAt?: Date;
}

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const chats = await Chat.find({
            participants: user._id,
        })
            .populate("participants", "username fullName profilePicture")
            .sort({ lastMessageAt: -1 })
            .lean() as ChatDoc[];

        const seenUsers = new Set<string>();
        const uniqueChats = chats.filter((chat) => {
            const otherUser = chat.participants.find(
                (p) => p._id.toString() !== user._id.toString()
            );
            if (!otherUser) return false;

            const oderId = otherUser._id.toString();
            if (seenUsers.has(oderId)) {
                return false;
            }
            seenUsers.add(oderId);
            return true;
        });

        // Calculate unread count for each chat
        const chatsWithUnread = await Promise.all(
            uniqueChats.map(async (chat) => {
                try {
                    // Count messages in this chat where:
                    // 1. seen is false
                    // 2. senderId is NOT the current user (messages FROM the other user)
                    const unreadCount = await Message.countDocuments({
                        chatId: chat._id,
                        seen: false,
                        senderId: { $ne: user._id },
                    });

                    return {
                        ...chat,
                        unreadCount,
                    };
                } catch (error) {
                    console.error("Error counting unread messages for chat:", chat._id, error);
                    return {
                        ...chat,
                        unreadCount: 0,
                    };
                }
            })
        );

        return NextResponse.json({ success: true, chats: chatsWithUnread });
    } catch (error) {
        console.error("Get chats error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch chats" },
            { status: 500 }
        );
    }
}
