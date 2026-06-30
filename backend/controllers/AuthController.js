import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup =(req,res)=>{
    const {userName,email,password}=req.body;
    const checkUser= User.findOne({email});
    if(checkUser) return res.status(404).json({message:"User already exist!"});

    const hashedPassword= bcrypt.hash(password,10);

    await User.create({
        userName: userName,
        email:email,
        password: hashedPassword
    });

    res.json({message:"User successfully registered!"});
}

export const login =(req,res)=>{
    const {email,password}=req.body;
    
    const checkUser= User.findOne({email});
    if(!checkUser) return res.status(404).json({message:"User Not found"});

    const comparedPassword= bcrypt.compare(password,checkUser.password);
    if(!comparedPassword) return res.status(404).json({message:""});

    const token=await jwt.sign(
        {
            _id: checkUser._id,
            userName: checkUser.userName,
            email: checkUser.email
        },
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    );
    console.log('USER LOGGED IN');
    console.log(token);
    
    res.json({token});
}