import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Follow from "@/models/Follow";
import Notification from "@/models/Notification";
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

        // Prevent self-follow
        if (session.userId === targetUserId) {
            return NextResponse.json(
                { success: false, message: "You cannot follow yourself" },
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

        // Check if already following
        const existingFollow = await Follow.findOne({
            follower: session.userId,
            following: targetUserId,
        });

        if (existingFollow) {
            return NextResponse.json(
                { success: false, message: "Already following this user" },
                { status: 400 }
            );
        }

        // Create follow relationship
        await Follow.create({
            follower: session.userId,
            following: targetUserId,
        });

        // Check if target user already follows current user (follow back scenario)
        const isFollowBack = await Follow.findOne({
            follower: targetUserId,
            following: session.userId,
        });

        // Create notification with appropriate message
        await Notification.create({
            recipient: targetUserId,
            sender: session.userId,
            type: "follow",
            message: isFollowBack ? "followed you back" : "started following you",
            link: `/profile/${currentUser.username}`,
        });

        return NextResponse.json({
            success: true,
            message: "Successfully followed user",
        });
    } catch (error) {
        console.error("Follow error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to follow user" },
            { status: 500 }
        );
    }
}
