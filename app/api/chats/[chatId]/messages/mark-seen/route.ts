import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { chatId } = await params;
        if (!chatId) {
            return NextResponse.json({ success: false, error: "Chat ID required" }, { status: 400 });
        }

        await connectToDatabase();

        console.log(`👁️ [MARK_AS_SEEN API] User ${user._id} marking messages as seen in chat ${chatId}`);

        // Mark all messages from other users as seen
        const result = await Message.updateMany(
            {
                chatId,
                senderId: { $ne: user._id },
                seen: false,
            },
            {
                seen: true,
                seenAt: new Date(),
            }
        );

        console.log(`✅ [MARK_AS_SEEN API] Marked ${result.modifiedCount} messages as seen`);

        return NextResponse.json({
            success: true,
            count: result.modifiedCount
        });
    } catch (error) {
        console.error("Mark as seen error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to mark messages as seen" },
            { status: 500 }
        );
    }
}
