import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        // Get all user's chats
        const chats = await Chat.find({
            participants: user._id,
        }).lean();

        // Calculate unread counts for each chat
        const countsPerChat: Record<string, number> = {};
        let totalUnreadChats = 0;

        for (const chat of chats) {
            const unreadCount = await Message.countDocuments({
                chatId: chat._id,
                seen: false,
                senderId: { $ne: user._id },
            });

            const chatIdStr = chat._id.toString();
            countsPerChat[chatIdStr] = unreadCount;

            if (unreadCount > 0) {
                totalUnreadChats++;
            }
        }

        console.log(`📊 [UNREAD API] User ${user._id}: ${totalUnreadChats} chats with unread`);

        return NextResponse.json({
            success: true,
            countsPerChat,
            totalUnreadChats,
        });
    } catch (error) {
        console.error("Get unread counts error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch unread counts" },
            { status: 500 }
        );
    }
}
