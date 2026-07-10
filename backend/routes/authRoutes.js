import { Router } from "express";
import {login,signup} from "../controllers/AuthController.js"
import { authLimiter } from "../middleware/RateLimiter.js";
const authRouter= Router();

authRouter.post('/signup',authLimiter,signup);
authRouter.post('/login',authLimiter,login);

export default authRouter;