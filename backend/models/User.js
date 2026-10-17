import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
        required: true
    },
}, { timestamps: true })

export const userModel = mongoose.model("UserModel", userSchema)