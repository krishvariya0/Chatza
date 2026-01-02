import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Follow from "@/models/Follow";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { targetUserId } = await req.json();

        if (!targetUserId) {
            return NextResponse.json(
                { success: false, message: "Target user ID is required" },
                { status: 400 }
            );
        }

        // Prevent self-unfollow
        if (session.userId === targetUserId) {
            return NextResponse.json(
                { success: false, message: "Invalid operation" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if users exist
        const [currentUser, targetUser] = await Promise.all([
            User.findById(session.userId),
            User.findById(targetUserId),
        ]);

        if (!currentUser || !targetUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Check if actually following
        const existingFollow = await Follow.findOne({
            follower: session.userId,
            following: targetUserId,
        });

        if (!existingFollow) {
            return NextResponse.json(
                { success: false, message: "Not following this user" },
                { status: 400 }
            );
        }

        // Delete follow relationship
        await Follow.deleteOne({
            follower: session.userId,
            following: targetUserId,
        });

        return NextResponse.json({
            success: true,
            message: "Successfully unfollowed user",
        });
    } catch (error) {
        console.error("Unfollow error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to unfollow user" },
            { status: 500 }
        );
    }
}
