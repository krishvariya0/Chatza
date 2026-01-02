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
    following: {
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

        // Get all following
        const followRelations = await Follow.find({ follower: user._id })
            .populate("following", "fullName username profilePicture")
            .lean();

        // Get current user's follow relationships
        const currentUserFollowing = await Follow.find({ follower: session.userId }).select("following");
        const currentUserFollowers = await Follow.find({ following: session.userId }).select("follower");

        const followingIds = new Set(currentUserFollowing.map((f: FollowDocument) => f.following.toString()));
        const followerIds = new Set(currentUserFollowers.map((f: FollowDocument) => f.follower.toString()));

        const followingWithStatus = followRelations.map((relation: PopulatedFollowRelation) => ({
            _id: relation.following._id,
            fullName: relation.following.fullName,
            username: relation.following.username,
            profilePicture: relation.following.profilePicture,
            isFollowing: followingIds.has(relation.following._id.toString()),
            isFollower: followerIds.has(relation.following._id.toString()),
            isCurrentUser: session.userId === relation.following._id.toString(),
        }));

        return NextResponse.json({
            success: true,
            following: followingWithStatus,
        });
    } catch (error) {
        console.error("Get following error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch following" },
            { status: 500 }
        );
    }
}
