import {listModel} from "../models/List.js";

export const createList=async (req,res) => {
    try{
        const list= await listModel.create({
            title: req.body.title,
            boardId: req.body.boardId,
            order: req.body.order
        });
        return res.status(201).json(list);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
export const fetchList=async (req,res) => {
    try{
        const lists= await listModel.find({boardId: req.params.boardId});
        return res.json(lists);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const updateList=async(req,res) => {
    try{
        const list= await listModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        return res.json(list);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
export const deleteList=async (req,res) => {
    try{
        await listModel.findByIdAndDelete(req.params.id);
        return res.json({message:"List deleted!"});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}