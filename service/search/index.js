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

        const sentRequestsOptions = {
            where: { receiverId: currentUserId },
            required: false,
        };

        if (filter === "friends") {
            sentRequestsOptions.where = {
                ...sentRequestsOptions.where,
                status: "accepted"
            };
            delete sentRequestsOptions.required;
        } else if (filter === "received") {
            sentRequestsOptions.where = {
                ...sentRequestsOptions.where,
                status:  {
                    [Op.not]: "accepted"
                }
            };
            delete sentRequestsOptions.required;
        }

        console.log("sentRequestsOptions", sentRequestsOptions);

        const include = [
            {
                model: User,
                as: "friends",
                attributes: ["id"],
                through: {
                    attributes: [],
                },
                required: false,
            },
            {
                model: FriendRequest,
                as: "sentRequests",
                include: [
                    {
                        model: User,
                        as: "sender",
                        attributes: ["id", "firstName", "lastName", "coverPhoto"],
                    },
                ],
                ...sentRequestsOptions,
            },
            {
                model: FriendRequest,
                as: "receivedRequests",
                where: {
                    senderId: currentUserId,
                },
                required: false,
                include: [
                    {
                        model: User,
                        as: "receiver",
                        attributes: ["id", "firstName", "lastName", "coverPhoto"],
                    },
                ],
            },
        ];

        const offset = (page - 1) * limit;

        const { rows: allUsers, count: totalCount} = await User.findAndCountAll({
            where,
            attributes: ["id", "firstName", "lastName", "coverPhoto"],
            include,
            limit,
            offset,
            group: ["User.id"]
        });

        // console.log(allUsers.find(u => u.id === 17)?.toJSON(), currentUserId)

        // console.log(allUsers[0])

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
                    sender: r.sender || null,
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
                    receiver: s.receiver || null,
                };
            }

            delete user.friends;
            delete user.sentRequests;
            delete user.receivedRequests;

            return { ...user, friendStatus, sentRequest, receivedRequest };
        });

        return {
            users: processedUsers,
            totalCount: totalCount.length,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        };
    }
}

export default new SearchService();
