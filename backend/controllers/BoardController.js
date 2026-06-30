import {boardModel} from "../models/Board.js";

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
        const board= await boardModel.findById(req.params._id);
        if(!board) return res.status(404).json({message:"Board not found"})
        return res.status(200).json(board);
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }

}