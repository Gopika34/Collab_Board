import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   
    max: 10, 
    skip: () => process.env.NODE_ENV === 'test',                     
    message: { message: "Too many attempts, please try again later" },
    standardHeaders: true,       
    legacyHeaders: false
});