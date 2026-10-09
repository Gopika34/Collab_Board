
import dotenv from "dotenv";
import { createServer } from "http";

import connectDB from "./config/db.js";
import app from "./app.js";
import { initializeSocket } from "./socket/socket.js";

dotenv.config();

const startServer = async () => {
    await connectDB();

    const httpServer = createServer(app);

    initializeSocket(httpServer);

    const port = process.env.PORT || 5000;

    httpServer.listen(port, () => {
        console.log(`Server is running at ${port}`);
    });
};

startServer();