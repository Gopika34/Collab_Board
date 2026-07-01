import {listModel} from "../models/List.js";

export const createList=async (req,res) => {
    try{
        const list= listModel.create({
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
export const getListByID=async (req,res) => {
    try{
        const lists= listModel.findById({boardId: req.params.boardId});
        return res.json(lists);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const updateList=async(req,res) => {
    try{
        const list= listModel.findByIdAndUpdate(
            req.params.boardId,
            req.body,
            {new:true}
        );
        return res.json(AudioListener);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
export const deleteList=async (req,res) => {
    try{
        const list= listModel.findByIdAndDelete(req.params.boardId);
        return res.json({message:"List deleted!"});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}