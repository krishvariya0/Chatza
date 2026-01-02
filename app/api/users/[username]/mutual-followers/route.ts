import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Follow from "@/models/Follow";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

interface FollowDocument {
    follower: { toString: () => string };
}

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

        await connectToDatabase();

        // Find user by username
        const user = await User.findOne({ username: username.toLowerCase() }).select("_id");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Get followers of the target user
        const targetUserFollowers = await Follow.find({ following: user._id }).select("follower");
        const targetUserFollowerIds = new Set(targetUserFollowers.map((f: FollowDocument) => f.follower.toString()));

        // Get followers of the current user
        const currentUserFollowers = await Follow.find({ following: session.userId }).select("follower");
        const currentUserFollowerIds = new Set(currentUserFollowers.map((f: FollowDocument) => f.follower.toString()));

        // Find mutual followers (people who follow both users)
        const mutualFollowerIds = [...targetUserFollowerIds].filter(id => currentUserFollowerIds.has(id));

        // Get user details for mutual followers (limit to 3 for preview)
        const mutualFollowers = await User.find({ _id: { $in: mutualFollowerIds.slice(0, 3) } })
            .select("fullName username profilePicture")
            .lean();

        return NextResponse.json({
            success: true,
            mutualFollowers,
            totalCount: mutualFollowerIds.length,
        });
    } catch (error) {
        console.error("Get mutual followers error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch mutual followers" },
            { status: 500 }
        );
    }
}
