import {Message, User} from "../models/models.js";

export const setupSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("joinRoom", (userId) => {
            socket.join(userId.toString());
            console.log(`User ${userId} joined room`);
        });

        socket.on("sendMessage", async (data) => {
            try {
                const { senderId, receiverId, message } = data;
                console.log(`📩 Message from ${senderId} to ${receiverId}: ${message}`);

                const newMessage = await Message.create({
                    senderId,
                    receiverId,
                    message,
                    createdAt: new Date(),
                });

                const sender = await User.findByPk(senderId, {
                    attributes: ["id", "firstName", "lastName", "coverPhoto"],
                });

                io.to(receiverId.toString()).emit("receiveMessage", {
                    id: newMessage.id,
                    senderId,
                    receiverId,
                    message,
                    sender,
                    createdAt: newMessage.createdAt,
                });

                io.to(senderId.toString()).emit("messageSent", {
                    id: newMessage.id,
                    senderId,
                    receiverId,
                    message,
                    sender,
                    createdAt: newMessage.createdAt,
                });
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });


        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
        });
    });
};
