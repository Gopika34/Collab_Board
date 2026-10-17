import { Router } from "express";
import {
    getAllUsers,
    changeUserRole
} from "../controllers/AdminController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const adminRoutes = Router();

adminRoutes.use(requireAdmin);

adminRoutes.get("/users", getAllUsers);

adminRoutes.patch("/users/:userId/role", changeUserRole);

export default adminRoutes;
