import { connectToDatabase } from "@/lib/mongoose";
import Follow from "@/models/Follow";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        await connectToDatabase();

        const { username } = await params;

        const user = await User.findOne({ username }).select("-password");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Get followers and following counts from Follow collection
        const [followersCount, followingCount] = await Promise.all([
            Follow.countDocuments({ following: user._id }),
            Follow.countDocuments({ follower: user._id }),
        ]);

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                location: user.location,
                website: user.website,
                joinedDate: user.joinedDate,
                followersCount,
                followingCount,
            },
        });
    } catch (error) {
        console.error("Get user by username error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
