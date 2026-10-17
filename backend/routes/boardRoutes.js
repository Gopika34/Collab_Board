import { createBoard, fetchBoard, getBoardById, updateBoard, deleteBoard } from "../controllers/BoardController.js";
import { Router } from "express";
import { verifyBoardAccess, verifyBoardOwnerAccess } from "../middleware/OwnershipMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createBoardSchema, updateBoardSchema } from "../validators/boardSchemas.js";
import {
    getBoardMembers,
    addBoardMember,
    removeBoardMember
} from "../controllers/BoardController.js";
import { getBoardActivity } from "../controllers/ActivityController.js";


const boardRoutes = Router();

boardRoutes.get('/', fetchBoard);
boardRoutes.post('/', validate(createBoardSchema), createBoard);
boardRoutes.get('/:id', verifyBoardAccess, getBoardById);
boardRoutes.patch('/:id', verifyBoardOwnerAccess, validate(updateBoardSchema), updateBoard);
boardRoutes.delete('/:id', verifyBoardOwnerAccess, deleteBoard);

boardRoutes.get(
    "/:id/members",
    verifyBoardAccess,
    getBoardMembers
);

boardRoutes.post(
    "/:id/members",
    verifyBoardOwnerAccess,
    addBoardMember
);

boardRoutes.delete(
    "/:id/members/:memberId",
    verifyBoardOwnerAccess,
    removeBoardMember
);

boardRoutes.get("/:id/activity", verifyBoardAccess,getBoardActivity);

export default boardRoutes;