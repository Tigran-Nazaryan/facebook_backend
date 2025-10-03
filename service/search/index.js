import { Op } from "sequelize";
import { User, FriendRequest } from "../../models/models.js";

class SearchService {
    async search(query = "", page = 1, limit = 10, currentUserId = null) {
        let where = {};

        if (query && query.trim() !== "") {
            const terms = query.trim().split(/\s+/);
            if (terms.length === 1) {
                where = {
                    [Op.or]: [
                        { firstName: { [Op.iLike]: `%${terms[0]}%` } },
                        { lastName: { [Op.iLike]: `%${terms[0]}%` } },
                    ],
                };
            } else if (terms.length >= 2) {
                where = {
                    [Op.and]: [
                        { firstName: { [Op.iLike]: `%${terms[0]}%` } },
                        { lastName: { [Op.iLike]: `%${terms[1]}%` } },
                    ],
                };
            }
        }

        if (currentUserId) {
            where = { [Op.and]: [{ id: { [Op.ne]: currentUserId } }, where] };
        }

        const totalCount = await User.count({ where });

        const users = await User.findAll({
            where,
            attributes: ["id", "firstName", "lastName", "coverPhoto"],
            limit,
            offset: (page - 1) * limit,
            order: [["id", "ASC"]],
            include: [
                {
                    model: FriendRequest,
                    as: "sentRequests",
                    where: { receiverId: currentUserId },
                    required: false,
                    attributes: ["id", "status"],
                },
                {
                    model: FriendRequest,
                    as: "receivedRequests",
                    where: { senderId: currentUserId },
                    required: false,
                    attributes: ["id", "status"],
                },
                {
                    model: User,
                    as: "friends",
                    where: { id: currentUserId },
                    required: false,
                    attributes: ["id"],
                }
            ]
        });

        const processedUsers = users.map((user) => {
            const u = user.toJSON();
            let friendStatus = null;
            let sentRequest = null;
            let receivedRequest = null;

            if (u.friends && u.friends.length > 0) {
                friendStatus = "accepted";
            }
            if (u.sentRequests && u.sentRequests.length > 0) {
                friendStatus = u.sentRequests[0]?.status || "pending";
                sentRequest = { id: u.sentRequests[0].id, status: u.sentRequests[0].status };
            }
            if (u.receivedRequests && u.receivedRequests.length > 0) {
                if (!friendStatus) {
                    friendStatus = u.receivedRequests[0]?.status || "pending";
                }
                receivedRequest = { id: u.receivedRequests[0].id, status: u.receivedRequests[0].status };
            }

            delete u.friends;
            delete u.sentRequests;
            delete u.receivedRequests;

            return { ...u, friendStatus, sentRequest, receivedRequest };
        });

        return {
            users: processedUsers,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        };
    }
}

export default new SearchService();

