import { createBoard, fetchBoard, getBoardById, updateBoard, deleteBoard } from "../controllers/BoardController.js";
import { Router } from "express";
import { verifyBoardAccess, verifyBoardOwnerAccess } from "../middleware/OwnershipMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createBoardSchema, updateBoardSchema } from "../validators/boardSchemas.js";

const boardRoutes = Router();

boardRoutes.get('/', fetchBoard);
boardRoutes.post('/', validate(createBoardSchema), createBoard);
boardRoutes.get('/:id', verifyBoardAccess, getBoardById);
boardRoutes.patch('/:id', verifyBoardOwnerAccess, validate(updateBoardSchema), updateBoard);
boardRoutes.delete('/:id', verifyBoardOwnerAccess, deleteBoard);

export default boardRoutes;