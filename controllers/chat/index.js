import MessageService from "../../service/chat/index.js";
import {Friend} from "../../models/models.js";

export const messages = async (req, res) => {
    try {
        const userId = req.user.id;
        const friendId = req.params.friendId;

        const isFriend = await Friend.findOne({
            where: { userId, friendId },
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
