import { listModel } from "../models/List.js";
import { cardModel } from "../models/Card.js";
import { emitToBoard } from "../socket/socket.js";

export const createList = async (req, res, next) => {
    try {
        const count = await listModel.countDocuments({ boardId: req.board._id });

        const list = await listModel.create({
            title: req.body.title,
            boardId: req.board._id,
            order: count
        });

        // Real-time: notify all users on this board
        emitToBoard(req.board._id, "list:created", {
            list,
            boardId: String(req.board._id)
        });

        return res.status(201).json(list);
    } catch (err) {
        next(err);
    }
};

export const fetchList = async (req, res, next) => {
    try {
        const lists = await listModel.find({ boardId: req.board._id });
        return res.json(lists);
    } catch (err) {
        next(err);
    }
};

export const updateList = async (req, res, next) => {
    try {
        Object.assign(req.list, req.body);
        await req.list.save();

        // Real-time: notify all users on this board
        emitToBoard(req.board._id, "list:updated", {
            list: req.list,
            boardId: String(req.board._id)
        });

        return res.json(req.list);
    } catch (err) {
        next(err);
    }
};

export const deleteList = async (req, res, next) => {
    try {
        const listId = String(req.list._id);
        const boardId = String(req.board._id);

        // Delete all cards in this list first
        await cardModel.deleteMany({ listId: req.list._id });
        await req.list.deleteOne();

        // Real-time: notify all users on this board
        emitToBoard(boardId, "list:deleted", { listId, boardId });

        return res.json({ message: "List deleted!" });
    } catch (err) {
        next(err);
    }
};