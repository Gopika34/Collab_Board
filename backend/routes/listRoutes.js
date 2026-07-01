import { createList,fetchList,updateList,deleteList } from "../controllers/ListController.S";
import {Router} from "express";

const listRoutes=Router();

listRoutes.get('/:boardId',fetchList);
listRoutes.post('/',createList);
listRoutes.patch('/:id',updateList);
listRoutes.delete('/:id',deleteList);

export default listRoutes;