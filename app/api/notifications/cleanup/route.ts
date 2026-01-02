import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

// This endpoint can be called by a cron job to clean up old notifications
export async function POST() {
    try {
        await connectToDatabase();

        // Delete notifications older than 15 days
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        const result = await Notification.deleteMany({
            createdAt: { $lt: fifteenDaysAgo },
        });

        console.log(`Cleaned up ${result.deletedCount} old notifications`);

        return NextResponse.json({
            success: true,
            message: `Deleted ${result.deletedCount} notifications older than 15 days`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error("Notification cleanup error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to cleanup notifications" },
            { status: 500 }
        );
    }
}
