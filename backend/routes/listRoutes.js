import { createList,fetchList,updateList,deleteList } from "../controllers/ListController.js";
import {Router} from "express";
import { verifyBoardAccessForList,verifyListAccess } from "../middleware/OwnershipMiddleware.js";
const listRoutes=Router();

listRoutes.get('/:boardId', verifyBoardAccessForList, fetchList);
listRoutes.post('/', verifyBoardAccessForList, createList);
listRoutes.patch('/:id', verifyListAccess, updateList);
listRoutes.delete('/:id', verifyListAccess, deleteList);

export default listRoutes;