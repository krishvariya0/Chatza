import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Chat from "@/models/Chat";
import Follow from "@/models/Follow";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const body = await request.json();
        const { recipientId } = body;

        if (!recipientId) {
            return NextResponse.json({ success: false, error: "Recipient ID required" }, { status: 400 });
        }

        // Check mutual follow
        const iFollow = await Follow.findOne({ follower: user._id, following: recipientId });
        const theyFollow = await Follow.findOne({ follower: recipientId, following: user._id });

        if (!iFollow || !theyFollow) {
            return NextResponse.json({
                success: false,
                error: "You can only chat with mutual followers"
            }, { status: 403 });
        }

        // Find existing chat or create new one
        let chat = await Chat.findOne({
            participants: { $all: [user._id, recipientId], $size: 2 },
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [user._id, recipientId],
            });
        }

        await chat.populate("participants", "username fullName profilePicture");

        return NextResponse.json({
            success: true,
            chat: chat.toObject(),
        });
    } catch (error) {
        console.error("Create chat error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create chat" },
            { status: 500 }
        );
    }
}
