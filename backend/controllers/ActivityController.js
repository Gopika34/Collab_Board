import { activityModel } from "../models/Activity.js";

export const getBoardActivity = async (req, res, next) => {
    try {
        const activities = await activityModel
            .find({ boardId: req.board._id })
            .populate("actorId", "userName email")
            .sort({ createdAt: -1 })
            .limit(50);

        return res.json(activities);
    } catch (error) {
        next(error);
    }
};