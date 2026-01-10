import { Model, Schema, model, models } from "mongoose";

interface MessageModel extends Model<unknown> {
    schema: Schema;
}

if (models.Message) {
    const MessageModel = models.Message as MessageModel;

    if (!MessageModel.schema.path("delivered")) {
        MessageModel.schema.add({
            delivered: {
                type: Boolean,
                default: false,
            },
        });
    }

    if (!MessageModel.schema.path("deliveredAt")) {
        MessageModel.schema.add({
            deliveredAt: {
                type: Date,
                default: null,
            },
        });
    }

    if (!MessageModel.schema.path("replyTo")) {
        MessageModel.schema.add({
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
