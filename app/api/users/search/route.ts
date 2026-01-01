import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import SearchHistory from "@/models/SearchHistory";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// GET - Search users OR get search history
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get("q");
        const history = searchParams.get("history");

        await connectToDatabase();

        // If history=true, return search history
        if (history === "true") {
            const searchHistory = await SearchHistory.find({ userId: session.userId })
                .sort({ searchedAt: -1 })
                .limit(10)
                .populate("searchedUserId", "username fullName profilePicture bio")
                .lean();

            interface PopulatedSearchHistory {
                searchedUserId: {
                    _id: { toString: () => string };
                    username: string;
                    fullName: string;
                    profilePicture: string | null;
                    bio: string;
                } | null;
            }

            const users = searchHistory
                .filter((item: PopulatedSearchHistory) => item.searchedUserId) // Filter out deleted users
                .map((item: PopulatedSearchHistory) => ({
                    id: item.searchedUserId!._id.toString(),
                    username: item.searchedUserId!.username,
                    fullName: item.searchedUserId!.fullName,
                    profilePicture: item.searchedUserId!.profilePicture,
                    bio: item.searchedUserId!.bio,
                }));

            return NextResponse.json({
                success: true,
                users,
            });
        }

        // Otherwise, search for users
        if (!query || query.trim() === "") {
            return NextResponse.json(
                { message: "Search query is required" },
                { status: 400 }
            );
        }

        // Search by username or fullName (case-insensitive)
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { fullName: { $regex: query, $options: "i" } },
            ],
        })
            .select("username fullName profilePicture bio")
            .limit(20)
            .lean();

        interface UserDocument {
            _id: { toString: () => string };
            username: string;
            fullName: string;
            profilePicture: string | null;
            bio: string;
        }

        return NextResponse.json({
            success: true,
            users: users.map((user: UserDocument) => ({
                id: user._id.toString(),
                username: user.username,
                fullName: user.fullName,
                profilePicture: user.profilePicture,
                bio: user.bio,
            })),
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { message: "Failed to search users" },
            { status: 500 }
        );
    }
}

// POST - Add user to search history
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchedUserId } = await req.json();

        if (!searchedUserId) {
            return NextResponse.json(
                { message: "Searched user ID is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if user exists
        const userExists = await User.findById(searchedUserId);
        if (!userExists) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Don't save if searching for self
        if (session.userId === searchedUserId) {
            return NextResponse.json({
                success: true,
                message: "Self search not saved",
            });
        }

        // Update or create search history entry
        await SearchHistory.findOneAndUpdate(
            {
                userId: session.userId,
                searchedUserId,
            },
            {
                userId: session.userId,
                searchedUserId,
                searchedAt: new Date(),
            },
            {
                upsert: true,
                new: true,
            }
        );

        return NextResponse.json({
            success: true,
            message: "Search history updated",
        });
    } catch (error) {
        console.error("Add to search history error:", error);
        return NextResponse.json(
            { message: "Failed to update search history" },
            { status: 500 }
        );
    }
}

// DELETE - Remove user from search history
export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const searchParams = req.nextUrl.searchParams;
        const searchedUserId = searchParams.get("userId");

        if (!searchedUserId) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        await SearchHistory.deleteOne({
            userId: session.userId,
            searchedUserId,
        });

        return NextResponse.json({
            success: true,
            message: "Removed from search history",
        });
    } catch (error) {
        console.error("Delete from search history error:", error);
        return NextResponse.json(
            { message: "Failed to remove from search history" },
            { status: 500 }
        );
    }
}
