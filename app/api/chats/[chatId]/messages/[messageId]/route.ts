import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// PATCH - Edit message
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string; messageId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const { chatId, messageId } = await params;
        const body = await request.json();
        const { text } = body;

        if (!text?.trim()) {
            return NextResponse.json({ success: false, error: "Message text required" }, { status: 400 });
        }

        const message = await Message.findById(messageId);
        if (!message) {
            return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 });
        }

        // Verify chat exists and user is participant
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });
        }

        const isParticipant = chat.participants.some(
            (p: Types.ObjectId) => p.toString() === user._id.toString()
        );

        if (!isParticipant) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        // Check if user is the sender
        if (message.senderId.toString() !== user._id.toString()) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        // Check if message is within 10 minutes
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        if (message.createdAt < tenMinutesAgo) {
            return NextResponse.json({
                success: false,
                error: "Can only edit messages within 10 minutes",
            }, { status: 400 });
        }

        // Update message
        message.text = text.trim();
        message.edited = true;
        message.editedAt = new Date();
        await message.save();

        await message.populate("senderId", "username fullName profilePicture");

        return NextResponse.json({
            success: true,
            message: message.toObject(),
        });
    } catch (error) {
        console.error("Edit message error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to edit message" },
            { status: 500 }
        );
    }
}

// DELETE - Delete message
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string; messageId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const { chatId, messageId } = await params;

        const message = await Message.findById(messageId);
        if (!message) {
            return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 });
        }

        // Verify chat exists and user is participant
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });
        }

        const isParticipant = chat.participants.some(
            (p: Types.ObjectId) => p.toString() === user._id.toString()
        );

        if (!isParticipant) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        // Check if user is the sender
        if (message.senderId.toString() !== user._id.toString()) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        // Check if message is within 10 minutes
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        if (message.createdAt < tenMinutesAgo) {
            return NextResponse.json({
                success: false,
                error: "Can only delete messages within 10 minutes",
            }, { status: 400 });
        }

        // Soft delete
        message.deleted = true;
        message.deletedAt = new Date();
        message.text = "This message was deleted";
        await message.save();

        return NextResponse.json({
            success: true,
            message: message.toObject(),
        });
    } catch (error) {
        console.error("Delete message error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete message" },
            { status: 500 }
        );
    }
}

