import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Follow from "@/models/Follow";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

interface FollowDocument {
    following: { toString: () => string };
    follower: { toString: () => string };
}

interface PopulatedFollowRelation {
    follower: {
        _id: { toString: () => string };
        fullName: string;
        username: string;
        profilePicture: string | null;
    };
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

        // Get all followers
        const followRelations = await Follow.find({ following: user._id })
            .populate("follower", "fullName username profilePicture")
            .lean();

        // Get current user's follow relationships
        const currentUserFollowing = await Follow.find({ follower: session.userId }).select("following");
        const currentUserFollowers = await Follow.find({ following: session.userId }).select("follower");

        const followingIds = new Set(currentUserFollowing.map((f: FollowDocument) => f.following.toString()));
        const followerIds = new Set(currentUserFollowers.map((f: FollowDocument) => f.follower.toString()));

        const followersWithStatus = followRelations.map((relation: PopulatedFollowRelation) => ({
            _id: relation.follower._id,
            fullName: relation.follower.fullName,
            username: relation.follower.username,
            profilePicture: relation.follower.profilePicture,
            isFollowing: followingIds.has(relation.follower._id.toString()),
            isFollower: followerIds.has(relation.follower._id.toString()),
            isCurrentUser: session.userId === relation.follower._id.toString(),
        }));

        return NextResponse.json({
            success: true,
            followers: followersWithStatus,
        });
    } catch (error) {
        console.error("Get followers error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch followers" },
            { status: 500 }
        );
    }
}
