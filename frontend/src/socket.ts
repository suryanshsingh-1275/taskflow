import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (socket) {
        return socket;
    }

    const token = localStorage.getItem("token");

    socket = io({
        path: "/socket.io",
        auth: {
            token,
        },
        transports: ["polling", "websocket"],
    });

    return socket;
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};
