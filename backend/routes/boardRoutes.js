import {createBoard,fetchBoard,getBoardById} from "../controllers/BoardController.js";
import {Router} from "express";
import { verifyBoardAccess } from "../middleware/OwnershipMiddleware.js";
const boardRoutes= Router();

boardRoutes.get('/',fetchBoard);
boardRoutes.post('/',createBoard);
boardRoutes.get('/:id',verifyBoardAccess,getBoardById);

export default boardRoutes;