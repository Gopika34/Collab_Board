import { boardModel } from "../models/Board.js";
import { listModel } from "../models/List.js";
import { cardModel } from "../models/Card.js";

export const verifyBoardAccess =async(req,res,next)=>{
    try{
        const board= await boardModel.findOne({
            _id: req.params.id,
            members: req.user._id
        });
        if(!board) return res.status(404).json({message: "Couldn't find the board"});
        req.board= board;
        next();
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const verifyBoardAccessForList =async(req,res,next)=>{
    try{
        const board= await boardModel.findOne({
            _id:req.params.boardId,
            members: req.user._id
        });
        if(!board) return res.status(403).json({message: "Not authorized"});
        req.board= board;
        next();
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const verifyListAccess =async(req,res,next)=>{
    try{
        const list=await listModel.findById(req.params.id);
        if(!list) return res.status(404).json({message: "Couldn't find the list"});

        const board= await boardModel.findOne({
            _id: list.boardId,
            members: req.user._id
        });
        if(!board) return res.status(403).json({message: "Not Authorized"});

        req.list=list;
        req.board= board;
        next();
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const verifyBoardAccessForCard =async(req,res,next)=>{
    try{
        const list= await boardModel.findOne(req.params.listId);
        if(!list) return res.status(404).json({message: "Couldn't find the list"});
        
        const board= await boardModel.findById({
            _id: list.boardId,
            members: req.user._id
        });
        if(!board) return res.status(403).json({message: "Not Authorized"});

        req.list= list;
        req.board=board;
        next();
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const verifyCardAccess = async (req, res, next) => {
    try {
        const card = await cardModel.findById(req.params.id);
        if (!card) return res.status(404).json({ message: "Card not found" });

        const currentList = await listModel.findById(card.listId);
        if (!currentList) return res.status(404).json({ message: "List not found" });

        const currentBoard = await boardModel.findOne({
            _id: currentList.boardId,
            members: req.user._id
        });
        if (!currentBoard) return res.status(403).json({ message: "Not authorized" });

        if (req.body.listId && String(req.body.listId) !== String(card.listId)) {
            const destList = await listModel.findById(req.body.listId);
            if (!destList) return res.status(404).json({ message: "Destination list not found" });

            const destBoard = await boardModel.findOne({
                _id: destList.boardId,
                members: req.user._id
            });
            if (!destBoard) {
                return res.status(403).json({ message: "Not authorized for destination board" });
            }
        }

        req.card = card;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};