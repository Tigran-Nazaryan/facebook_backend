import { Op } from "sequelize";
import {Message, User} from "../../models/models.js";

class MessageService {
    static async getMessages(userId, friendId) {
        return await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId, receiverId: friendId },
                    { senderId: friendId, receiverId: userId },
                ],
            },
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: ["id", "firstName", "lastName", "coverPhoto"],
                },
            ],
            order: [["createdAt", "ASC"]],
        });
    }

    // static async sendMessage(senderId, receiverId, message) {
    //     if (!senderId || !receiverId || !message.trim()) {
    //         throw new Error("Not enough data");
    //     }
    //
    //     return await Message.create({
    //         senderId,
    //         receiverId,
    //         message,
    //         createdAt: new Date(),
    //     });
    // }
}

export default MessageService;
