export const setupSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        socket.on("joinRoom", (userId) => {
            socket.join(userId.toString());
            console.log(`👤 User ${userId} joined room`);
        });

        socket.on("sendMessage", (data) => {
            const { senderId, receiverId, message } = data;
            console.log(`📩 Message from ${senderId} to ${receiverId}: ${message}`);

            io.to(receiverId.toString()).emit("receiveMessage", {
                senderId,
                receiverId,
                message,
                createdAt: new Date(),
            });

            io.to(senderId.toString()).emit("messageSent", data);
        });

        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
        });
    });
};
