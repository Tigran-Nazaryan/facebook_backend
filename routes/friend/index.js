import {Router} from "express";
import {
    acceptFriendRequest,
    deleteFriendRequest,
    getReceivedRequests,
    removeFriend,
    sendFriendRequest
} from "../../controllers/friend/index.js";

const friendRouter = Router();

friendRouter.post("/", sendFriendRequest);
friendRouter.get("/received/:userId", getReceivedRequests);
friendRouter.post("/:id/accept", acceptFriendRequest);
friendRouter.delete("/:id", deleteFriendRequest);
friendRouter.delete("/:friendId/remove", removeFriend);

export default friendRouter;
