import MessageService from "../../service/chat/index.js";
import { Friend } from "../../models/models.js";

export const messages = async (req, res) => {
    try {
        const userId = req.user.id;
        const friendId = req.params.friendId;

        const isFriend = await Friend.findOne({
            where: {
                userId,
                friendId,
            },
        });

        if (!isFriend) {
            return res.status(403).json({ message: "You cannot view messages with this user" });
        }

        const msgs = await MessageService.getMessages(userId, friendId);
        res.json(msgs);
    } catch (error) {
        console.error("Error receiving messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const send = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, message } = req.body;

        if (!receiverId || !message.trim()) {
            return res.status(400).json({ message: "Not enough data" });
        }

        const isFriend = await Friend.findOne({
            where: {
                userId: senderId,
                friendId: receiverId,
            },
        });

        if (!isFriend) {
            return res.status(403).json({ message: "You cannot message this user" });
        }

        const newMessage = await MessageService.sendMessage(senderId, receiverId, message);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};
