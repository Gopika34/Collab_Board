import {createBoard,fetchBoard,getBoardById,updateBoard, deleteBoard} from "../controllers/BoardController.js";
import {Router} from "express";
import { verifyBoardAccess,verifyBoardOwnerAccess } from "../middleware/OwnershipMiddleware.js";

const boardRoutes= Router();

boardRoutes.get('/',fetchBoard);
boardRoutes.post('/',createBoard);
boardRoutes.get('/:id',verifyBoardAccess,getBoardById);
boardRoutes.get('/:id',verifyBoardOwnerAccess,updateBoard);
boardRoutes.get('/:id',verifyBoardOwnerAccess,deleteBoard);

export default boardRoutes;