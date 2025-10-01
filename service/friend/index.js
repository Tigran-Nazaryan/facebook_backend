import { Op } from "sequelize";
import {FriendRequest, User, Friend} from "../../models/models.js";

export class FriendService {
    async sendFriendRequest(senderId, receiverId) {
        if (senderId === receiverId) {
            throw new Error("You cannot send a friend request to yourself");
        }

        const areFriends = await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId: senderId, friendId: receiverId },
                    { userId: receiverId, friendId: senderId },
                ],
            },
        });

        if (areFriends) {
            throw new Error("You are already friends with this user");
        }

        const existing = await FriendRequest.findOne({
            where: {
                [Op.or]: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
        });

        if (existing) {
            throw new Error("Friend request already exists");
        }

        return await FriendRequest.create({ senderId, receiverId, status: "pending" });
    }

    async getReceivedRequests(userId) {
        return await FriendRequest.findAll({
            where: { receiverId: userId, status: "pending" },
            include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName"] }],
        });
    }

    async getSentRequests(userId) {
        return await FriendRequest.findAll({
            where: { senderId: userId, status: "pending" },
            include: [{ model: User, as: "receiver", attributes: ["id", "firstName", "lastName"] }],
        });
    }

    async acceptFriendRequest(requestId, userId) {
        const request = await FriendRequest.findOne({ where: { id: requestId, receiverId: userId } });
        if (!request) {
            throw new Error("Friend request not found or not authorized");
        }

        request.status = "accepted";
        await request.save();

        await Friend.create({ userId: request.senderId, friendId: userId });
        await Friend.create({ userId, friendId: request.senderId });

        return request;
    }

    async deleteFriendRequest(requestId, userId) {
        const request = await FriendRequest.findOne({
            where: {
                id: requestId,
                [Op.or]: [{ senderId: userId }, { receiverId: userId }],
            },
        });

        if (!request) {
            throw new Error("Friend request not found or not authorized");
        }

        await request.destroy();
    }

    async removeFriend(userId, friendId) {
        await Friend.destroy({
            where: {
                [Op.or]: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId },
                ],
            },
        });
    }
}
