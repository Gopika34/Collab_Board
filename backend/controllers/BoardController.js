import { boardModel } from "../models/Board.js";
import { listModel } from "../models/List.js";
import { cardModel } from "../models/Card.js";
import { userModel } from "../models/User.js";
import { logActivity } from "../utils/logActivity.js";

export const createBoard = async (req, res, next) => {
    try {
        const board = await boardModel.create({
            title: req.body.title,
            owner: req.user._id,
            members: [req.user._id]
        });

        const defaultLists = ['Todo', 'Doing', 'Done'];
        await Promise.all(
            defaultLists.map((title, index) =>
                listModel.create({
                    title,
                    boardId: board._id,
                    order: index
                })
            )
        );

        return res.status(201).json(board);
    } catch (err) {
        next(err);
    }
};

export const fetchBoard = async (req, res, next) => {
    try {
        const boards = await boardModel.find({ members: req.user._id });
        return res.status(200).json(boards);
    } catch (err) {
        next(err);
    }
};

export const getBoardById = async (req, res, next) => {
    try {
        return res.status(200).json(req.board);
    } catch (err) {
        next(err);
    }
};

export const updateBoard = async (req, res, next) => {
    try {
        const board = await boardModel.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user._id
            },
            { title: req.body.title },
            { new: true }
        );
        if (!board) return res.status(404).json({ message: "Board not found" });
        return res.json(board);
    } catch (err) {
        next(err);
    }
};

export const deleteBoard = async (req, res, next) => {
    try {
        const board = await boardModel.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!board) return res.status(404).json({ message: "Board not found" });

        const lists = await listModel.find({ boardId: board._id });
        const listIds = lists.map(list => list._id);

        await cardModel.deleteMany({ listId: { $in: listIds } });
        await listModel.deleteMany({ boardId: board._id });

        return res.json({ message: "Board and all its lists/cards deleted!" });
    } catch (err) {
        next(err);
    }
};


export const getBoardMembers = async (req, res, next) => {
    try {
        const board = await boardModel
            .findById(req.params.id)
            .populate("owner", "userName email role")
            .populate("members", "userName email role");

        if (!board) {
            return res.status(404).json({
                message: "Board not found"
            });
        }

        return res.json({
            owner: board.owner,
            members: board.members
        });
    } catch (error) {
        next(error);
    }
};

export const addBoardMember = async (req, res, next) => {
    try {
        const email = req.body.email?.toLowerCase().trim();

        if (!email) {
            return res.status(400).json({
                message: "User email is required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "No registered user found with that email"
            });
        }

        await boardModel.updateOne(
            { _id: req.board._id },
            { $addToSet: { members: user._id } }
        );

        const board = await boardModel
            .findById(req.board._id)
            .populate("owner", "userName email")
            .populate("members", "userName email role");

        await logActivity({
            boardId: req.board._id,
            actorId: req.user._id,
            action: "LIST_CREATED",
            targetType: "list",
            targetId: list._id,
            message: `${req.user.userName} created list "${list.title}"`
        });

        return res.status(200).json({
            message: "Member added successfully",
            owner: board.owner,
            members: board.members
        });
    } catch (error) {
        next(error);
    }
};

export const removeBoardMember = async (req, res, next) => {
    try {
        const memberId = req.params.memberId;

        if (String(req.board.owner) === String(memberId)) {
            return res.status(400).json({
                message: "The board owner cannot be removed"
            });
        }

        const board = await boardModel.findByIdAndUpdate(
            req.board._id,
            { $pull: { members: memberId } },
            { new: true }
        ).populate("members", "userName email role");

        if (!board) {
            return res.status(404).json({
                message: "Board not found"
            });
        }

        await logActivity({
            boardId: req.board._id,
            actorId: req.user._id,
            action: "LIST_CREATED",
            targetType: "list",
            targetId: list._id,
            message: `${req.user.userName} created list "${list.title}"`
        });

        return res.json({
            message: "Member removed successfully",
            members: board.members
        });
    } catch (error) {
        next(error);
    }
};
