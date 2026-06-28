import mongoose from "mongoose";

const cardSchema= mongoose.Schema({

    title:{
        type: String,
        trim: true,
        required: true
    },

    title:{
        type: String,
        trim: true,
        default: ''
    },

    listId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    
    order:{
        type: "Number",
        required: true
    }
},{timestamps: true});

export const cardModel= mongoose.model('CardModel',cardSchema);