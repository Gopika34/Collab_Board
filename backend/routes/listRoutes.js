import { createList, fetchList, updateList, deleteList } from "../controllers/ListController.js";
import { Router } from "express";
import { verifyBoardAccessForList, verifyListAccess } from "../middleware/OwnershipMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createListSchema, updateListSchema } from "../validators/listSchemas.js";

const listRoutes = Router();

listRoutes.get('/:boardId', verifyBoardAccessForList, fetchList);
listRoutes.post('/', verifyBoardAccessForList, validate(createListSchema), createList);
listRoutes.patch('/:id', verifyListAccess, validate(updateListSchema), updateList);
listRoutes.delete('/:id', verifyListAccess, deleteList);

export default listRoutes;