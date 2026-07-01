import {createBoard,fetchBoard,getBoardById} from "../controllers/BoardController.js";
import {Router} from "express";

const boardRoutes= Router();

boardRoutes.get('/',fetchBoard);
boardRoutes.post('/',createBoard);
boardRoutes.get('/:id',getBoardById);

export default boardRoutes;