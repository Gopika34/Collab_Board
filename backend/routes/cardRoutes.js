import { fetchCard, createCard,updateCard,deleteCard } from "../controllers/CardController.js";
import {Router} from "express";
import { verifyBoardAccessForCard,verifyCardAccess } from "../middleware/OwnershipMiddleware.js";
const cardRoutes=Router();

cardRoutes.get('/:listId', verifyBoardAccessForCard, fetchCard);
cardRoutes.post('/', verifyBoardAccessForCard, createCard);
cardRoutes.patch('/:id', verifyCardAccess, updateCard);
cardRoutes.delete('/:id', verifyCardAccess, deleteCard);

export default cardRoutes;