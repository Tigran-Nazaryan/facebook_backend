import { Op } from "sequelize";

export const getMessages = async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId, receiverId: friendId },
                    { senderId: friendId, receiverId: userId }
                ]
            },
            order: [["createdAt", "ASC"]],
        });

        res.json(messages);
    } catch (error) {
        console.error("Error receiving messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        if (!senderId || !receiverId || !message.trim()) {
            return res.status(400).json({ message: "Not enough data" });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
            createdAt: new Date(),
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
};
