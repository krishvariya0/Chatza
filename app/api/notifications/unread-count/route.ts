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

        const unreadCount = await Notification.countDocuments({
            recipient: session.userId,
            isRead: false,
        });

        return NextResponse.json({
            success: true,
            unreadCount,
        });
    } catch (error) {
        console.error("Get unread count error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch unread count" },
            { status: 500 }
        );
    }
}
