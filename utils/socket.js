import { Server as SocketIOServer } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new SocketIOServer(server, {
        cors: { origin: "*", methods: ["GET", "POST"] },
    });
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
