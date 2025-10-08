import {Op} from "sequelize";
import {FriendRequest, User} from "../../models/models.js";

class SearchService {
    async search(query = "", page = 1, limit = 10, currentUserId = null, filter = "all") {
        let where = {};

        if (query && query.trim()) {
            const terms = query.trim().split(/\s+/);
            if (terms.length === 1) {
                where = {
                    [Op.or]: [
                        {firstName: {[Op.iLike]: `%${terms[0]}%`}},
                        {lastName: {[Op.iLike]: `%${terms[0]}%`}},
                    ],
                };
            } else {
                where = {
                    [Op.and]: [
                        {firstName: {[Op.iLike]: `%${terms[0]}%`}},
                        {lastName: {[Op.iLike]: `%${terms[1]}%`}},
                    ],
                };
            }
        }

        if (currentUserId) {
            where = {[Op.and]: [{id: {[Op.ne]: currentUserId}}, where]};
        }

        const sentRequestsOptions = {
            where: {receiverId: currentUserId},
            required: false,
        };

        const receivedRequestsOptions = {
            where: {senderId: currentUserId},
            required: false,
        };

        if (filter === "friends") {
            sentRequestsOptions.where = {
                ...sentRequestsOptions.where,
                status: "accepted"
            };
            receivedRequestsOptions.where = {
                ...receivedRequestsOptions.where,
                status: "accepted"
            };
        } else if (filter === "received") {
            sentRequestsOptions.where = {
                ...sentRequestsOptions.where,
                status: {
                    [Op.not]: "accepted"
                }
            };
            sentRequestsOptions.required = true;
        }

        console.log("sentRequestsOptions", sentRequestsOptions);
        console.log("receivedRequestsOptions", receivedRequestsOptions);

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
                include: [
                    {
                        model: User,
                        as: "receiver",
                        attributes: ["id", "firstName", "lastName", "coverPhoto"],
                    },
                ],
                ...receivedRequestsOptions,
            },
        ];

        let allUsers;
        let totalCount;

        if (filter === "friends") {

            const sentFriendsQuery = await User.findAndCountAll({
                where,
                attributes: ["id", "firstName", "lastName", "coverPhoto"],
                include: [
                    {
                        model: User,
                        as: "friends",
                        attributes: ["id"],
                        through: {attributes: []},
                        required: false,
                    },
                    {
                        model: FriendRequest,
                        as: "receivedRequests",
                        where: {
                            senderId: currentUserId,
                            status: "accepted"
                        },
                        required: true,
                        include: [{
                            model: User,
                            as: "receiver",
                            attributes: ["id", "firstName", "lastName", "coverPhoto"],
                        }],
                    },
                    {
                        model: FriendRequest,
                        as: "sentRequests",
                        where: {receiverId: currentUserId},
                        required: false,
                        include: [{
                            model: User,
                            as: "sender",
                            attributes: ["id", "firstName", "lastName", "coverPhoto"],
                        }],
                    },
                ],
                distinct: true,
            });

            const receivedFriendsQuery = await User.findAndCountAll({
                where,
                attributes: ["id", "firstName", "lastName", "coverPhoto"],
                include: [
                    {
                        model: User,
                        as: "friends",
                        attributes: ["id"],
                        through: {attributes: []},
                        required: false,
                    },
                    {
                        model: FriendRequest,
                        as: "sentRequests",
                        where: {
                            receiverId: currentUserId,
                            status: "accepted"
                        },
                        required: true,
                        include: [{
                            model: User,
                            as: "sender",
                            attributes: ["id", "firstName", "lastName", "coverPhoto"],
                        }],
                    },
                    {
                        model: FriendRequest,
                        as: "receivedRequests",
                        where: {senderId: currentUserId},
                        required: false,
                        include: [{
                            model: User,
                            as: "receiver",
                            attributes: ["id", "firstName", "lastName", "coverPhoto"],
                        }],
                    },
                ],
                distinct: true,
            });

            const userMap = new Map();

            [...sentFriendsQuery.rows, ...receivedFriendsQuery.rows].forEach(user => {
                if (!userMap.has(user.id)) {
                    userMap.set(user.id, user);
                }
            });

            allUsers = Array.from(userMap.values());
            totalCount = allUsers.length;

            const offset = (page - 1) * limit;
            allUsers = allUsers.slice(offset, offset + limit);

        } else {
            const offset = (page - 1) * limit;

            const result = await User.findAndCountAll({
                where,
                attributes: ["id", "firstName", "lastName", "coverPhoto"],
                include,
                limit,
                offset,
                distinct: true,
            });

            allUsers = result.rows;
            totalCount = result.count;
        }

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
                if (r.status) friendStatus = r.status;
                receivedRequest = {
                    id: r.id,
                    status: r.status,
                    senderId: r.senderId,
                    receiverId: r.receiverId,
                    receiver: r.receiver || null,
                };
            }

            if (user.sentRequests && user.sentRequests.length > 0) {
                const s = user.sentRequests[0];
                if (!friendStatus && s.status) friendStatus = s.status;
                sentRequest = {
                    id: s.id,
                    status: s.status,
                    senderId: s.senderId,
                    receiverId: s.receiverId,
                    sender: s.sender || null,
                };
            }

            delete user.friends;
            delete user.sentRequests;
            delete user.receivedRequests;

            return {...user, friendStatus, sentRequest, receivedRequest};
        });

        return {
            users: processedUsers,
            totalCount: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        };
    }
}

export default new SearchService();