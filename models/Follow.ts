import { Schema, model, models } from "mongoose";

const FollowSchema = new Schema(
    {
        follower: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        following: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

// Compound index for efficient queries
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });
FollowSchema.index({ following: 1, follower: 1 });

const Follow = models.Follow || model("Follow", FollowSchema);

export default Follow;
