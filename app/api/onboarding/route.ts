import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        const { username, fullName, profilePicture, bio, location, website } = await req.json();

        // Check if username is being changed
        if (username && username !== currentUser.username) {
            // Validate username format
            if (!/^[a-z0-9_]{3,30}$/.test(username)) {
                return NextResponse.json(
                    { message: "Username must be 3-30 characters and contain only lowercase letters, numbers, and underscores" },
                    { status: 400 }
                );
            }

            // Check if username is already taken
            const existingUser = await User.findOne({ username, _id: { $ne: currentUser._id } });
            if (existingUser) {
                return NextResponse.json(
                    { message: "Username is already taken" },
                    { status: 400 }
                );
            }
        }

        const updateData: {
            profilePicture?: string;
            bio?: string;
            location?: string;
            website?: string;
            onboardingCompleted: boolean;
            username?: string;
            fullName?: string;
        } = {
            profilePicture,
            bio,
            location,
            website,
            onboardingCompleted: true,
        };

        // Only update username if provided and different
        if (username && username !== currentUser.username) {
            updateData.username = username;
        }

        // Only update fullName if provided
        if (fullName) {
            updateData.fullName = fullName;
        }

        const user = await User.findByIdAndUpdate(
            currentUser._id,
            updateData,
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update onboarding_completed cookie
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.set("onboarding_completed", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: "/",
        });

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                profilePicture: user.profilePicture,
                bio: user.bio,
                location: user.location,
                website: user.website,
            },
        });
    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json(
            { message: "Failed to update profile" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: currentUser._id,
                username: currentUser.username,
                fullName: currentUser.fullName,
                email: currentUser.email,
                profilePicture: currentUser.profilePicture,
                bio: currentUser.bio,
                location: currentUser.location,
                website: currentUser.website,
                onboardingCompleted: currentUser.onboardingCompleted,
                joinedDate: currentUser.joinedDate,
            },
        });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json(
            { message: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
