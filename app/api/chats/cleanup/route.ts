import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

interface ChatDoc {
    _id: Types.ObjectId;
    participants: Types.ObjectId[];
    lastMessage?: string;
    lastMessageAt?: Date;
}

export async function POST() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const chats = await Chat.find({
            participants: user._id,
        }).sort({ lastMessageAt: -1 }).lean() as ChatDoc[];

        const chatsByOtherUser: Record<string, ChatDoc[]> = {};

        for (const chat of chats) {
            const otherUser = chat.participants.find(
                (p) => p.toString() !== user._id.toString()
            );

            if (otherUser) {
                const oderId = otherUser.toString();
                if (!chatsByOtherUser[oderId]) {
                    chatsByOtherUser[oderId] = [];
                }
                chatsByOtherUser[oderId].push(chat);
            }
        }

        let deletedCount = 0;
        let mergedMessages = 0;

        for (const userChats of Object.values(chatsByOtherUser)) {
            if (userChats.length > 1) {
                userChats.sort((a, b) => {
                    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
                    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
                    return bTime - aTime;
                });

                const keepChat = userChats[0];
                const duplicateChats = userChats.slice(1);

                for (const dupChat of duplicateChats) {
                    const result = await Message.updateMany(
                        { chatId: dupChat._id },
                        { chatId: keepChat._id }
                    );
                    mergedMessages += result.modifiedCount;
                    await Chat.findByIdAndDelete(dupChat._id);
                    deletedCount++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${deletedCount} duplicate chats, merged ${mergedMessages} messages`,
            deletedCount,
            mergedMessages,
        });
    } catch (error) {
        console.error("Cleanup chats error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to cleanup chats" },
            { status: 500 }
        );
    }
}
