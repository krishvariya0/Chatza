import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Follow from "@/models/Follow";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { recipientId } = await request.json();
        if (!recipientId) {
            return NextResponse.json(
                { error: "Recipient ID required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if current user follows recipient
        const userFollowsRecipient = await Follow.findOne({
            follower: user._id,
            following: recipientId,
        });

        // Check if recipient follows current user
        const recipientFollowsUser = await Follow.findOne({
            follower: recipientId,
            following: user._id,
        });

        const canChat = !!(userFollowsRecipient && recipientFollowsUser);

        return NextResponse.json({
            canChat,
            reason: canChat
                ? "Mutual followers"
                : "You must follow each other to chat",
        });
    } catch (error) {
        console.error("Can chat check error:", error);
        return NextResponse.json(
            { error: "Failed to check chat eligibility" },
            { status: 500 }
        );
    }
}
