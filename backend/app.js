import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js'
import listRoutes from './routes/listRoutes.js'
import cardRoutes from './routes/cardRoutes.js'
import {AuthMiddleware} from "./middleware/AuthMiddleware.js";

const app= express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth',authRoutes);

app.use('/api/boards',AuthMiddleware,boardRoutes);
app.use('/api/lists',AuthMiddleware,listRoutes);
app.use('/api/cards',AuthMiddleware,cardRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong" });
});

export default app;