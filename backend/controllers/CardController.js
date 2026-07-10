import {cardModel} from "../models/Card.js";

export const createCard=async (req,res) => {
    try{
        const card= await cardModel.create({
            title: req.body.title,
            description:req.body.description,
            listId:req.body.listId,
            order:req.body.order
        });
        return res.status(201).json(card);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
export const fetchCard=async (req,res) => {
    try{
        const cards = await cardModel.find({listId:req.params.listId});
        return res.json(cards);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
export const updateCard=async (req,res) => {
    try{
        const card= await cardModel.findOneAndUpdate(
            {
                _id:req.params.id
            },
            req.body,
            {new:true}
        );
        return res.json(card);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
export const deleteCard=async (req,res) => {
    try{
        await cardModel.findOneAndDelete({_id: req.params.id});
        return res.json({message:"Card deleted!"});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
