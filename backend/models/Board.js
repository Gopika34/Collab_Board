import mongoose from "mongoose";

const boardSchema= mongoose.Schema({

    title:{
        type: String,
        trim: true,
        required: true
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },

    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    }]
},{timestamps: true});

export const boardModel= mongoose.model('BoardModel',boardSchema);