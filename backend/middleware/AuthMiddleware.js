import jwt from "jsonwebtoken";
import { userModel } from "../models/User.js";

export const AuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({
                message: "User account not found"
            });
        }

        req.user = {
            _id: String(user._id),
            userName: user.userName,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
