import { Router } from "express";
import { login, signup } from "../controllers/AuthController.js";
import { authLimiter } from "../middleware/RateLimiter.js";
import { validate } from "../middleware/validate.js";
import { signupSchema, loginSchema } from "../validators/authSchemas.js";

const authRouter = Router();

authRouter.post('/signup', authLimiter, validate(signupSchema), signup);
authRouter.post('/login', authLimiter, validate(loginSchema), login);

export default authRouter;