import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../models/User.js";

export const signup = async (req, res, next) => {
    try {
        // req.body is already validated & coerced by Zod (validate middleware)
        const { userName, email, password } = req.body;

        const checkUser = await userModel.findOne({ email });
        if (checkUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            userName: userName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        return res.status(201).json({ message: "User successfully registered!" });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const checkUser = await userModel
            .findOne({ email: email.toLowerCase().trim() })
            .select('+password');

        if (!checkUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!checkUser.password) {
            console.error(`User ${email} has no password field in database`);
            return res.status(500).json({ message: "Account configuration error. Please contact support." });
        }

        const comparedPassword = await bcrypt.compare(password, checkUser.password);
        if (!comparedPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                _id: checkUser._id,
                userName: checkUser.userName,
                email: checkUser.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({ token });
    } catch (err) {
        next(err);
    }
};