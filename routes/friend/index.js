import {Router} from "express";
import {
    acceptFriendRequest, deleteFriendRequest,
    getReceivedRequests,
    getSentRequests, removeFriend,
    sendFriendRequest
} from "../../controllers/friend/index.js";

const friendRouter = Router();

friendRouter.post("/", sendFriendRequest);
friendRouter.get("/received/:userId", getReceivedRequests);
friendRouter.get("/sent/:userId", getSentRequests);
friendRouter.post("/:id/accept", acceptFriendRequest);
friendRouter.delete("/:id", deleteFriendRequest);
friendRouter.delete("/:friendId/remove", removeFriend);

export default friendRouter;
