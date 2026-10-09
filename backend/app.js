import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import listRoutes from './routes/listRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import { AuthMiddleware } from "./middleware/AuthMiddleware.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/boards', AuthMiddleware, boardRoutes);
app.use('/api/lists', AuthMiddleware, listRoutes);
app.use('/api/cards', AuthMiddleware, cardRoutes);

// 404 handler — unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Centralized error handler — all next(err) calls land here
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err.stack);

    // Don't leak internal error details in production
    const statusCode = err.statusCode || err.status || 500;
    const message =
        statusCode < 500
            ? err.message
            : "Something went wrong on our end. Please try again later.";

    res.status(statusCode).json({ message });
});

export default app;