import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/models/Notification";
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

        const body = await req.json();
        const { notificationId } = body;

        await connectToDatabase();

        if (notificationId) {
            // Mark single notification as read
            await Notification.findOneAndUpdate(
                { _id: notificationId, recipient: session.userId },
                { isRead: true }
            );
        } else {
            // Mark all notifications as read
            await Notification.updateMany(
                { recipient: session.userId, isRead: false },
                { isRead: true }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Notifications marked as read",
        });
    } catch (error) {
        console.error("Mark notifications read error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to mark notifications as read" },
            { status: 500 }
        );
    }
}
