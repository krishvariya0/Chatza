import { Schema, model, models } from "mongoose";

const SearchHistorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        searchedUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        searchedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Compound index to ensure unique user-searchedUser pairs
SearchHistorySchema.index({ userId: 1, searchedUserId: 1 }, { unique: true });

// Index for efficient queries
SearchHistorySchema.index({ userId: 1, searchedAt: -1 });

const SearchHistory = models.SearchHistory || model("SearchHistory", SearchHistorySchema);

export default SearchHistory;
