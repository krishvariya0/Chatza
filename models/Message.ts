import { Schema, model, models } from "mongoose";

if (models.Message) {
    if (!(models.Message as any).schema.path("delivered")) {
        (models.Message as any).schema.add({
            delivered: {
                type: Boolean,
                default: false,
            },
        });
    }

    if (!(models.Message as any).schema.path("deliveredAt")) {
        (models.Message as any).schema.add({
            deliveredAt: {
                type: Date,
                default: null,
            },
        });
    }

    if (!(models.Message as any).schema.path("replyTo")) {
        (models.Message as any).schema.add({
            replyTo: {
                type: {
                    messageId: { type: String },
                    text: { type: String },
                    senderId: { type: String },
                    senderName: { type: String },
                },
                required: false,
                default: undefined,
            },
        });
    }
}

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
        delivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: {
            type: Date,
            default: null,
        },
        replyTo: {
            type: {
                messageId: { type: String },
                text: { type: String },
                senderId: { type: String },
                senderName: { type: String },
            },
            required: false,
            default: undefined,
        },
    },
    { timestamps: true }
);

MessageSchema.index({ chatId: 1, createdAt: -1 });

const Message = models.Message || model("Message", MessageSchema);

export default Message;
