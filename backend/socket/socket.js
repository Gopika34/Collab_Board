import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { boardModel } from "../models/Board.js";

let io;

export const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin:
                process.env.CLIENT_URL ||
                "http://localhost:5173",
            methods: ["GET", "POST", "PATCH", "DELETE"]
        }
    });

    // Authenticate each incoming socket connection.
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication required"));
        }

        try {
            socket.user = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            next();
        } catch {
            next(new Error("Invalid or expired token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // Join only boards this user is allowed to access.
        socket.on("board:join", async (payload, acknowledge) => {
            const reply =
                typeof acknowledge === "function"
                    ? acknowledge
                    : () => {};

            try {
                const boardId = payload?.boardId;

                if (
                    typeof boardId !== "string" ||
                    !mongoose.Types.ObjectId.isValid(boardId)
                ) {
                    return reply({
                        ok: false,
                        message: "Invalid board ID"
                    });
                }

                const board = await boardModel.findOne({
                    _id: boardId,
                    members: socket.user._id
                });

                if (!board) {
                    return reply({
                        ok: false,
                        message: "Board not found or access denied"
                    });
                }

                // Keep this socket in only one board room for now.
                for (const room of socket.rooms) {
                    if (room.startsWith("board:")) {
                        await socket.leave(room);
                    }
                }

                const room = `board:${boardId}`;

                await socket.join(room);

                console.log(
                    `Socket ${socket.id} joined ${room}`
                );

                reply({
                    ok: true,
                    boardId
                });
            } catch (error) {
                console.error("Board join failed:", error);

                reply({
                    ok: false,
                    message: "Could not join board"
                });
            }
        });

        socket.on("board:leave", async (payload) => {
            const boardId = payload?.boardId;

            if (
                typeof boardId === "string" &&
                mongoose.Types.ObjectId.isValid(boardId)
            ) {
                await socket.leave(`board:${boardId}`);
            }
        });

        socket.on("disconnect", (reason) => {
            console.log(
                "Socket disconnected:",
                socket.id,
                reason
            );
        });
    });

    return io;
};

// Controllers will use this after saving database changes.
export const emitToBoard = (boardId, event, data) => {
    if (!io) {
        return;
    }

    io.to(`board:${boardId}`).emit(event, data);
};