import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {userModel} from "../models/User.js";

export const signup =async(req,res)=>{
    const {userName,email,password}=req.body;
    const checkUser= await userModel.findOne({email});
    if(checkUser) return res.status(409).json({message:"User already exist!"});

    const hashedPassword= await bcrypt.hash(password,10);

    await userModel.create({
        userName: userName,
        email:email,
        password: hashedPassword
    });

    res.json({message:"User successfully registered!"});
}

export const login =async(req,res)=>{
    const {email,password}=req.body;
    
    const checkUser= await userModel.findOne({email});
    if(!checkUser) return res.status(401).json({message:"Invalid credentials"});

    const comparedPassword= await bcrypt.compare(password,checkUser.password);
    if(!comparedPassword) return res.status(401).json({message:"Invalid credentials"});

    const token=await jwt.sign(
        {
            _id: checkUser._id,
            userName: checkUser.userName,
            email: checkUser.email
        },
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    );
    
    res.json({token});
}