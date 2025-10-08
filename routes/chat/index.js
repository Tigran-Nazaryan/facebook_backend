import {Router} from "express";
import {getMessages, sendMessage} from "../../controllers/chat/index.js";

const chatRouter = Router();

// chatRouter.get("/:userId/:friendId", messages);
// chatRouter.post("/", send);

export default chatRouter;
