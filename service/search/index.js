import { Op } from "sequelize";
import { FriendRequest, User } from "../../models/models.js";

class SearchService {
    async search(query = "", page = 1, limit = 10, currentUserId = null, filter = "all") {
        let where = {};

        if (query && query.trim()) {
            const terms = query.trim().split(/\s+/);
            if (terms.length === 1) {
                where = {
                    [Op.or]: [
                        { firstName: { [Op.iLike]: `%${terms[0]}%` } },
                        { lastName: { [Op.iLike]: `%${terms[0]}%` } },
                    ],
                };
            } else {
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

        const include = [
            {
                model: User,
                as: "friends",
                attributes: ["id"],
                through: { attributes: [] },
                required: false,
            },
            {
                model: FriendRequest,
                as: "sentRequests",
                where: { receiverId: currentUserId },
                required: false,
            },
            {
                model: FriendRequest,
                as: "receivedRequests",
                where: { senderId: currentUserId },
                required: false,
            },
        ];

        const allUsers = await User.findAll({
            where,
            attributes: ["id", "firstName", "lastName", "coverPhoto"],
            include,
        });

        let processedUsers = allUsers.map((u) => {
            const user = u.toJSON();
            let friendStatus = null;
            let sentRequest = null;
            let receivedRequest = null;

            if (user.friends && user.friends.some((f) => f.id === currentUserId)) {
                friendStatus = "accepted";
            }

            if (user.receivedRequests && user.receivedRequests.length > 0) {
                const r = user.receivedRequests[0];
                friendStatus = r.status;
                receivedRequest = {
                    id: r.id,
                    status: r.status,
                    senderId: r.senderId,
                    receiverId: r.receiverId,
                };
            }

            if (user.sentRequests && user.sentRequests.length > 0) {
                const s = user.sentRequests[0];
                if (!friendStatus) friendStatus = s.status;
                sentRequest = {
                    id: s.id,
                    status: s.status,
                    senderId: s.senderId,
                    receiverId: s.receiverId,
                };
            }


            delete user.friends;
            delete user.sentRequests;
            delete user.receivedRequests;

            return { ...user, friendStatus, sentRequest, receivedRequest };
        });

        if (filter === "friends") {
            processedUsers = processedUsers.filter((u) => u.friendStatus === "accepted");
        } else if (filter === "pending") {
            processedUsers = processedUsers.filter((u) => u.friendStatus === "pending");
        } else if (filter === "rejected") {
            processedUsers = processedUsers.filter((u) => u.friendStatus === "rejected");
        }

        const totalCount = processedUsers.length;

        const paginatedUsers = processedUsers.slice((page - 1) * limit, page * limit);

        return {
            users: paginatedUsers,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        };
    }
}

export default new SearchService();

