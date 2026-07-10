import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js'
import listRoutes from './routes/listRoutes.js'
import cardRoutes from './routes/cardRoutes.js'
import {AuthMiddleware} from "./middleware/AuthMiddleware.js";

dotenv.config();
connectDB();

const app= express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/boards',AuthMiddleware,boardRoutes);
app.use('/api/lists',AuthMiddleware,listRoutes);
app.use('/api/cards',AuthMiddleware,cardRoutes);

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})