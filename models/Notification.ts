import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["follow", "like", "comment", "mention"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        link: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Compound index for efficient queries
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });

// TTL index to automatically delete notifications older than 15 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 24 * 60 * 60 });

const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;
