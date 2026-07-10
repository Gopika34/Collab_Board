import {boardModel} from "../models/Board.js";
import { listModel } from "../models/List.js";
import { cardModel } from "../models/Card.js";

export const createBoard=async(req,res)=>{
    try{
        const board= await boardModel.create({
            title:req.body.title,
            owner: req.user._id,
            members:[req.user._id]
        });
        return res.status(201).json(board);
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const fetchBoard=async(req,res)=>{
    try{
        const boards= await boardModel.find({members: req.user._id});
        return res.status(200).json(boards);
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const getBoardById=async(req,res)=>{
    try{
        return res.status(200).json(req.board);
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const updateBoard=async(req,res)=>{
    try{
        const board= await boardModel.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user._id
            },
            {title: req.body.title},
            {new:true}
        );
        if(!board) return res.status(404).json({message:"Board not found!"});
        return res.json(board);
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const deleteBoard=async(req,res)=>{
    try{
        const board= await boardModel.findOneAndDelete(
            {
                _id: req.params.id,
                owner: req.user._id
            }
        );
        if(!board) return res.status(404).json({message:"Board not found!"});

        const lists= await listModel.find({boardId:board._id});
        const listIds= lists.map(list=> list._id);

        await cardModel.deleteMany({ listId: { $in: listIds } });
        await listModel.deleteMany({ boardId: board._id });

        return res.json({message:"Board and all its lists/cards deleted!"});
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}