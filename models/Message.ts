import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
    {
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
        seen: {
            type: Boolean,
            default: false,
        },
        seenAt: {
            type: Date,
            default: null,
        },
        edited: {
            type: Boolean,
            default: false,
        },
        editedAt: {
            type: Date,
            default: null,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

MessageSchema.index({ chatId: 1, createdAt: -1 });

const Message = models.Message || model("Message", MessageSchema);

export default Message;
