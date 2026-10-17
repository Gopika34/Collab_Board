import { activityModel } from "../models/Activity.js";
import { emitToBoard } from "../socket/socket.js";

export const logActivity = async ({
    boardId,
    actorId,
    action,
    targetType,
    targetId,
    message,
    metadata = {}
}) => {
    const activity = await activityModel.create({
        boardId,
        actorId,
        action,
        targetType,
        targetId,
        message,
        metadata
    });

    const populatedActivity = await activity.populate(
        "actorId",
        "userName email"
    );

    emitToBoard(boardId, "activity:created", {
        activity: populatedActivity
    });

    return populatedActivity;
};
