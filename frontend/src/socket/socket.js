import { io } from "socket.io-client";

const socketUrl =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

export const socket = io(socketUrl, {
    autoConnect: false,

    // Read the token when connecting, not when this module loads.
    auth: (callback) => {
        callback({
            token: localStorage.getItem("token")
        });
    }
});