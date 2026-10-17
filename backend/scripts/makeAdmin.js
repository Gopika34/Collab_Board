
import "dotenv/config";
import connectDB from "../config/db.js";
import { userModel } from "../models/User.js";

const makeAdmin = async () => {
    try {
        const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();

        if (!email) {
            throw new Error("Set ADMIN_EMAIL in backend .env first");
        }

        await connectDB();

        const user = await userModel.findOne({ email });

        if (!user) {
            throw new Error(
                "No account found. Sign up with this email first."
            );
        }

        user.role = "ADMIN";
        await user.save();

        console.log(`${user.email} is now ADMIN`);
        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

makeAdmin();