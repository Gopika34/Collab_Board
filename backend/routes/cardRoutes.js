import { fetchCard, createCard, updateCard, deleteCard } from "../controllers/CardController.js";
import { Router } from "express";
import { verifyBoardAccessForCard, verifyCardAccess } from "../middleware/OwnershipMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createCardSchema, updateCardSchema } from "../validators/cardSchemas.js";

const cardRoutes = Router();

cardRoutes.get('/:listId', verifyBoardAccessForCard, fetchCard);
cardRoutes.post('/', verifyBoardAccessForCard, validate(createCardSchema), createCard);
cardRoutes.patch('/:id', verifyCardAccess, validate(updateCardSchema), updateCard);
cardRoutes.delete('/:id', verifyCardAccess, deleteCard);

export default cardRoutes;