import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;


export const getSocket = (): Socket => {

    if (socket) {
        return socket;
    }

    const token = localStorage.getItem("token");

    // auth: { token } is what server.js's io.use(...) middleware
    // reads as socket.handshake.auth.token — same JWT the REST API
    // already trusts, no separate login for sockets.
    socket = io(
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5001",
        {
            auth: { token },
        }
    );

    return socket;

};

export const disconnectSocket = () => {

    socket?.disconnect();

    socket = null;

};
