import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BoardModel",
        required: true,
        index: true
    },

    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },

    action: {
        type: String,
        enum: [
            "BOARD_CREATED",
            "MEMBER_ADDED",
            "MEMBER_REMOVED",
            "LIST_CREATED",
            "LIST_UPDATED",
            "LIST_DELETED",
            "LIST_REORDERED",
            "CARD_CREATED",
            "CARD_UPDATED",
            "CARD_MOVED",
            "CARD_DELETED"
        ],
        required: true
    },

    targetType: {
        type: String,
        enum: ["board", "member", "list", "card"],
        required: true
    },

    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    message: {
        type: String,
        required: true,
        maxlength: 300
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

activitySchema.index({ boardId: 1, createdAt: -1 });

export const activityModel = mongoose.model(
    "ActivityModel",
    activitySchema
);
