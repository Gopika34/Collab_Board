import {cardModel} from "../models/Card.js";

export const createCard=async (req,res) => {
    try{
        const { title, description, order } = req.body;

        const card = await cardModel.create({
            title,
            description,
            listId: req.list._id,
            order
        });
        return res.status(201).json(card);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const fetchCard=async (req,res) => {
    try{
        // const cards = await cardModel.find({listId:req.params.listId});
        const cards = await cardModel.find({listId:req.list._id});
        return res.json(cards);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const updateCard=async (req,res) => {
    try{
        // const card= await cardModel.findOneAndUpdate(
        //     {
        //         _id:req.params.id
        //     },
        //     req.body,
        //     {new:true}
        // );
        // return res.json(card);

        Object.assign(req.card,req.body);
        await req.card.save();
        return res.json(req.card);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const deleteCard=async (req,res) => {
    try{
        // const card=await cardModel.findOneAndDelete({_id: req.params.id});
        // if (!card) {
        //     return res.status(404).json({
        //         message: "Card not found!"
        //     });
        // }

        await req.card.deleteOne();
        return res.json({message:"Card deleted!"});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
