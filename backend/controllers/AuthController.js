import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {userModel} from "../models/User.js";

export const signup =async(req,res)=>{
    const {userName,email,password}=req.body;

    if (!email || !password || !userName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const checkUser= await userModel.findOne({email});
    if(checkUser) return res.status(409).json({message:"User already exist!"});

    const hashedPassword= await bcrypt.hash(password,10);

    await userModel.create({
        userName: userName.trim(),
        email:email.toLowerCase().trim(),
        password: hashedPassword
    });

    res.json({message:"User successfully registered!"});
}

export const login =async(req,res)=>{
    const {email,password}=req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const checkUser= await userModel.findOne({email: email.toLowerCase().trim()}).select('+password');;
    if(!checkUser) return res.status(401).json({message:"Invalid credentials"});

    if (!checkUser.password) {
        console.error(`User ${email} found, but has no password field in database! Check your Schema.`);
        return res.status(500).json({ message: "Account configuration issue. Please contact support." });
    }

    const comparedPassword= await bcrypt.compare(password,checkUser.password);
    if(!comparedPassword) return res.status(401).json({message:"Invalid credentials"});

    const token=jwt.sign(
        {
            _id: checkUser._id,
            userName: checkUser.userName,
            email: checkUser.email
        },
        process.env.JWT_SECRET || 'fallback_secret',
        {expiresIn:"7d"}
    );
    
    res.json({token});
}