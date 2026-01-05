import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Follow from "@/models/Follow";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        // Get people I follow
        const following = await Follow.find({ follower: session.userId }).select("following");
        const followingIds = following.map((f) => f.following.toString());

        // Get people who follow me
        const followers = await Follow.find({ following: session.userId }).select("follower");
        const followerIds = new Set(followers.map((f) => f.follower.toString()));

        // Find mutual followers (people I follow who also follow me back)
        const mutualFollowerIds = followingIds.filter((id) => followerIds.has(id));

        // Get user details for mutual followers
        const mutualFollowers = await User.find({ _id: { $in: mutualFollowerIds } })
            .select("_id fullName username profilePicture")
            .lean();

        return NextResponse.json({
            success: true,
            mutualFollowers,
            totalCount: mutualFollowers.length,
        });
    } catch (error) {
        console.error("Get mutual followers error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch mutual followers" },
            { status: 500 }
        );
    }
}
