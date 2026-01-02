import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/models/Notification";
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

        // Delete notifications older than 15 days
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        await Notification.deleteMany({
            recipient: session.userId,
            createdAt: { $lt: fifteenDaysAgo },
        });

        const notifications = await Notification.find({
            recipient: session.userId,
        })
            .populate("sender", "fullName username profilePicture")
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        const unreadCount = await Notification.countDocuments({
            recipient: session.userId,
            isRead: false,
        });

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Get notifications error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}
