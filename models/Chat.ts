import { Schema, model, models } from "mongoose";

const ChatSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        lastMessage: {
            type: String,
            default: null,
        },
        lastMessageAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

ChatSchema.path("participants").validate(function (value: Schema.Types.ObjectId[]) {
    return value.length === 2;
}, "Chat must have exactly 2 participants");

ChatSchema.index({ participants: 1 });

const Chat = models.Chat || model("Chat", ChatSchema);

export default Chat;
