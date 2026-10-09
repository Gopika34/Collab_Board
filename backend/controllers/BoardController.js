import { boardModel } from "../models/Board.js";
import { listModel } from "../models/List.js";
import { cardModel } from "../models/Card.js";

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