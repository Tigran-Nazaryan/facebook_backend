// import { Op } from "sequelize";
// import { FriendRequest, User, Friend } from "../../models/models.js";
//
// class SearchService {
//     async search(query = "", page = 1, limit = 10, currentUserId = null, filter = "all") {
//         let where = {};
//
//         // Search by firstName / lastName
//         if (query && query.trim()) {
//             const terms = query.trim().split(/\s+/);
//             if (terms.length === 1) {
//                 where = {
//                     [Op.or]: [
//                         { firstName: { [Op.iLike]: `%${terms[0]}%` } },
//                         { lastName: { [Op.iLike]: `%${terms[0]}%` } },
//                     ],
//                 };
//             } else {
//                 where = {
//                     [Op.and]: [
//                         { firstName: { [Op.iLike]: `%${terms[0]}%` } },
//                         { lastName: { [Op.iLike]: `%${terms[1]}%` } },
//                     ],
//                 };
//             }
//         }
//
//         if (currentUserId) {
//             where = { [Op.and]: [{ id: { [Op.ne]: currentUserId } }, where] };
//         }
//
//         // Include relationships
//         const include = [
//             {
//                 model: User,
//                 as: "friends",
//                 attributes: ["id"],
//                 through: { attributes: [] }, // include Friend table but no extra attributes
//                 required: false, // important to avoid empty arrays
//             },
//             {
//                 model: FriendRequest,
//                 as: "sentRequests",
//                 where: { receiverId: currentUserId },
//                 required: false,
//                 attributes: ["id", "status"],
//             },
//             {
//                 model: FriendRequest,
//                 as: "receivedRequests",
//                 where: { senderId: currentUserId },
//                 required: false,
//                 attributes: ["id", "status"],
//             },
//         ];
//
//         const allUsers = await User.findAll({
//             where,
//             attributes: ["id", "firstName", "lastName", "coverPhoto"],
//             include,
//         });
//
//         // Map friendStatus and filter
//         let processedUsers = allUsers.map((u) => {
//             const user = u.toJSON();
//             let friendStatus = null;
//             let sentRequest = null;
//             let receivedRequest = null;
//
//             // Check if current user is friend
//             if (user.friends && user.friends.some((f) => f.id === currentUserId)) {
//                 friendStatus = "accepted";
//             }
//
//             if (user.sentRequests && user.sentRequests.length > 0) {
//                 friendStatus = user.sentRequests[0]?.status;
//                 sentRequest = { id: user.sentRequests[0].id, status: user.sentRequests[0].status };
//             }
//
//             if (user.receivedRequests && user.receivedRequests.length > 0) {
//                 if (!friendStatus) friendStatus = user.receivedRequests[0]?.status;
//                 receivedRequest = { id: user.receivedRequests[0].id, status: user.receivedRequests[0].status };
//             }
//
//             delete user.friends;
//             delete user.sentRequests;
//             delete user.receivedRequests;
//
//             return { ...user, friendStatus, sentRequest, receivedRequest };
//         });
//
//         // Apply backend filter
//         if (filter === "friends") {
//             processedUsers = processedUsers.filter((u) => u.friendStatus === "accepted");
//         } else if (filter === "pending") {
//             processedUsers = processedUsers.filter((u) => u.friendStatus === "pending");
//         } else if (filter === "rejected") {
//             processedUsers = processedUsers.filter((u) => u.friendStatus === "rejected");
//         }
//
//         const totalCount = processedUsers.length;
//
//         // Apply pagination
//         const paginatedUsers = processedUsers.slice((page - 1) * limit, page * limit);
//
//         return {
//             users: paginatedUsers,
//             totalCount,
//             currentPage: page,
//             totalPages: Math.ceil(totalCount / limit),
//         };
//     }
// }
//
// export default new SearchService();
//
// import { Op } from "sequelize";
// import { FriendRequest, User, Friend } from "../../models/models.js";
//
// class SearchService {
//     async search(query = "", page = 1, limit = 10, currentUserId = null, filter = "all") {
//         let where = {};
//
//         // Search by firstName / lastName
//         if (query && query.trim()) {
//             const terms = query.trim().split(/\s+/);
//             if (terms.length === 1) {
//                 where = {
//                     [Op.or]: [
//                         { firstName: { [Op.iLike]: `%${terms[0]}%` } },
//                         { lastName: { [Op.iLike]: `%${terms[0]}%` } },
//                     ],
//                 };
//             } else {
//                 where = {
//                     [Op.and]: [
//                         { firstName: { [Op.iLike]: `%${terms[0]}%` } },
//                         { lastName: { [Op.iLike]: `%${terms[1]}%` } },
//                     ],
//                 };
//             }
//         }
//
//         if (currentUserId) {
//             where = { [Op.and]: [{ id: { [Op.ne]: currentUserId } }, where] };
//         }
//
//         // Include relationships
//         const include = [
//             {
//                 model: User,
//                 as: "friends",
//                 attributes: ["id"],
//                 through: { attributes: [] },
//                 required: false,
//             },
//             {
//                 model: FriendRequest,
//                 as: "sentRequests",
//                 where: { senderId: currentUserId },
//                 required: false,
//                 attributes: ["id", "status"],
//             },
//             {
//                 model: FriendRequest,
//                 as: "receivedRequests",
//                 where: { receiverId: currentUserId },
//                 required: false,
//                 attributes: ["id", "status"],
//             },
//         ];
//
//         const allUsers = await User.findAll({
//             where,
//             attributes: ["id", "firstName", "lastName", "coverPhoto"],
//             include,
//         });
//
//         // Map friendStatus and filter
//         let processedUsers = allUsers.map((u) => {
//             const user = u.toJSON();
//             let friendStatus = null;
//             let sentRequest = null;
//             let receivedRequest = null;
//
//             // Check if current user is friend
//             if (user.friends && user.friends.some((f) => f.id === currentUserId)) {
//                 friendStatus = "accepted";
//             }
//
//             // receivedRequests are requests FROM other users TO current user
//             if (user.receivedRequests && user.receivedRequests.length > 0) {
//                 friendStatus = user.receivedRequests[0]?.status;
//                 receivedRequest = {
//                     id: user.receivedRequests[0].id,
//                     status: user.receivedRequests[0].status
//                 };
//             }
//
//             // sentRequests are requests FROM current user TO other users
//             if (user.sentRequests && user.sentRequests.length > 0) {
//                 if (!friendStatus) friendStatus = user.sentRequests[0]?.status;
//                 sentRequest = {
//                     id: user.sentRequests[0].id,
//                     status: user.sentRequests[0].status
//                 };
//             }
//
//             delete user.friends;
//             delete user.sentRequests;
//             delete user.receivedRequests;
//
//             return { ...user, friendStatus, sentRequest, receivedRequest };
//         });
//
//         // Apply backend filter
//         if (filter === "friends") {
//             processedUsers = processedUsers.filter((u) => u.friendStatus === "accepted");
//         } else if (filter === "pending") {
//             processedUsers = processedUsers.filter((u) => u.friendStatus === "pending");
//         } else if (filter === "rejected") {
//             processedUsers = processedUsers.filter((u) => u.friendStatus === "rejected");
//         } else if (filter === "received") {
//             processedUsers = processedUsers.filter(
//                 (u) => u.receivedRequest && u.receivedRequest.status === "pending"
//             );
//         }
//
//         const totalCount = processedUsers.length;
//
//         // Apply pagination
//         const paginatedUsers = processedUsers.slice((page - 1) * limit, page * limit);
//
//         return {
//             users: paginatedUsers,
//             totalCount,
//             currentPage: page,
//             totalPages: Math.ceil(totalCount / limit),
//         };
//     }
// }
//
// export default new SearchService();

// src/service/search.js

import { Op } from "sequelize";
import { FriendRequest, User, Friend } from "../../models/models.js"; // Adjust path as needed

class SearchService {
    // Current user ID must be provided by the controller/middleware
    async search(query = "", page = 1, limit = 10, currentUserId = null, filter = "all") {
        let where = {};

        // --- 1. BUILD SEARCH QUERY ---

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
            // Exclude the current user from the results
            where = { [Op.and]: [{ id: { [Op.ne]: currentUserId } }, where] };
        }

        // --- 2. INCLUDE RELATIONSHIPS ---

        const include = [
            // Friends (mutual relationship)
            {
                model: User,
                as: "friends",
                attributes: ["id"],
                through: { attributes: [] },
                required: false,
            },
            // Requests SENT by the current user to this user
            {
                model: FriendRequest,
                as: "sentRequests",
                where: { senderId: currentUserId },
                required: false,
                attributes: ["id", "status"],
            },
            // Requests RECEIVED by the current user from this user
            {
                model: FriendRequest,
                as: "receivedRequests",
                where: { receiverId: currentUserId },
                required: false,
                attributes: ["id", "status"],
            },
        ];

        const allUsers = await User.findAll({
            where,
            attributes: ["id", "firstName", "lastName", "coverPhoto"],
            include,
        });

        // --- 3. MAP STATUS AND APPLY FILTER ---

        let processedUsers = allUsers.map((u) => {
            const user = u.toJSON();
            let friendStatus = null;
            let sentRequest = undefined; // Use undefined for null/empty for client-side typing
            let receivedRequest = undefined;

            // Priority 1: Check if already friends
            if (user.friends && user.friends.some((f) => f.id === currentUserId)) {
                friendStatus = "accepted";
            }

            // Priority 2: Check for received request (other user sent to current user)
            if (user.receivedRequests && user.receivedRequests.length > 0) {
                // If not already friends, use the request status
                if (!friendStatus) friendStatus = user.receivedRequests[0]?.status;
                receivedRequest = {
                    id: user.receivedRequests[0].id,
                    status: user.receivedRequests[0].status
                };
            }

            // Priority 3: Check for sent request (current user sent to other user)
            if (user.sentRequests && user.sentRequests.length > 0) {
                // If not already friends or already processing received, use sent request status
                if (!friendStatus) friendStatus = user.sentRequests[0]?.status;
                sentRequest = {
                    id: user.sentRequests[0].id,
                    status: user.sentRequests[0].status
                };
            }

            // Clean up raw data from Sequelize model
            delete user.friends;
            delete user.sentRequests;
            delete user.receivedRequests;

            return { ...user, friendStatus, sentRequest, receivedRequest };
        });

        // --- 4. APPLY BACKEND FILTERING (if needed) ---

        if (filter === "friends") {
            processedUsers = processedUsers.filter((u) => u.friendStatus === "accepted");
        } else if (filter === "received") {
            // Only show users who have a pending request sent TO the current user
            processedUsers = processedUsers.filter(
                (u) => u.receivedRequest && u.receivedRequest.status === "pending"
            );
        }
        // NOTE: Filters like "pending" and "rejected" are usually better handled by the frontend
        // based on the friendStatus/sentRequest/receivedRequest flags for simplicity.


        const totalCount = processedUsers.length;

        // --- 5. APPLY PAGINATION ---

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