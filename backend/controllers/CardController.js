import { cardModel } from "../models/Card.js";
import { emitToBoard } from "../socket/socket.js";

export const createCard = async (req, res, next) => {
    try {
        const { title, description, order } = req.body;

        const card = await cardModel.create({
            title,
            description,
            listId: req.list._id,
            order
        });

        // Real-time: notify all users on this board
        emitToBoard(req.board._id, "card:created", {
            card,
            listId: String(req.list._id),
            boardId: String(req.board._id)
        });

        return res.status(201).json(card);
    } catch (err) {
        next(err);
    }
};

export const fetchCard = async (req, res, next) => {
    try {
        const cards = await cardModel.find({ listId: req.list._id });
        return res.json(cards);
    } catch (err) {
        next(err);
    }
};

export const updateCard = async (req, res, next) => {
    try {
        Object.assign(req.card, req.body);
        await req.card.save();

        // Real-time: notify all users on this board
        emitToBoard(req.board._id, "card:updated", {
            card: req.card,
            listId: String(req.card.listId),
            boardId: String(req.board._id)
        });

        return res.json(req.card);
    } catch (err) {
        next(err);
    }
};

export const deleteCard = async (req, res, next) => {
    try {
        const cardId = String(req.card._id);
        const listId = String(req.card.listId);
        const boardId = String(req.board._id);

        await req.card.deleteOne();

        // Real-time: notify all users on this board
        emitToBoard(boardId, "card:deleted", { cardId, listId, boardId });

        return res.json({ message: "Card deleted!" });
    } catch (err) {
        next(err);
    }
};
