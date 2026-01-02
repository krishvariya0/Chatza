import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Follow from "@/models/Follow";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { username } = await params;

        if (!username) {
            return NextResponse.json(
                { success: false, message: "Username is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Find target user by username
        const targetUser = await User.findOne({ username: username.toLowerCase() }).select("_id");

        if (!targetUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Check if current user follows target user
        const isFollowing = await Follow.exists({
            follower: session.userId,
            following: targetUser._id,
        });

        // Check if target user follows current user
        const isFollower = await Follow.exists({
            follower: targetUser._id,
            following: session.userId,
        });

        return NextResponse.json({
            success: true,
            isFollowing: !!isFollowing,
            isFollower: !!isFollower,
            targetUserId: targetUser._id.toString(),
        });
    } catch (error) {
        console.error("Follow status error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to get follow status" },
            { status: 500 }
        );
    }
}
