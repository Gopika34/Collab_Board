import { fetchCard, createCard,updateCard,deleteCard } from "../controllers/CardController.js";
import {Router} from "express";

const cardRoutes=Router();

cardRoutes.get('/:listId',fetchCard);
cardRoutes.post('/',createCard);
cardRoutes.patch('/:id',updateCard);
cardRoutes.delete('/:id',deleteCard);

export default cardRoutes;