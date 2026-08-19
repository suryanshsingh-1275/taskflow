import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {

    if (socket) {
        return socket;
    }

    const token = localStorage.getItem("token");


    socket = io("http://localhost:5001", {
        auth: { token },
    });

    return socket;

};

export const disconnectSocket = () => {

    socket?.disconnect();

    socket = null;

};