import mongoose from "mongoose";

const listSchema= mongoose.Schema({

    title:{
        type: String,
        trim: true,
        required: true
    },

    boardId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BoardModel',
        required: true
    },
    
    order:{
        type: Number,
        required: true
    }
},{timestamps: true});

export const listModel= mongoose.model('ListModel',listSchema);