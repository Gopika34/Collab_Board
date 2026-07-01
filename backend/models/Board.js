import mongoose from "mongoose";

const boardSchema= mongoose.Schema({

    title:{
        type: String,
        trim: true,
        required: true
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },

    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }]
},{timestamps: true});

export const boardModel= mongoose.model('BoardModel',boardSchema);