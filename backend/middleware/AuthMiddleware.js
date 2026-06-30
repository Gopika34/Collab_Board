import jwt from 'jsonwebtoken';

export const AuthMiddleware=(req,res,next)=>{
    const token= req.headers.authorization?.split(' ')[1]
    if(!token) return res.status(401).json({message:"Token not found"});

    try{
        const verifiedToken= await jwt.verify(token,process.env.JWT_SECRET);
        console.log(verifiedToken);
        // middleware
        console.log("MIDDLEWARE SECRET:", process.env.JWT_SECRET);
        console.log("TOKEN ID:", verifiedToken.id);
        req.user=verifiedToken;
        next();

    }
    catch(err){
        return res.status(403).json({message: err.message})
    }
}
