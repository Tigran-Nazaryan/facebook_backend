import {Router} from "express";
import {messages, send} from "../../controllers/chat/index.js";

const chatRouter = Router();

chatRouter.get("/:userId/:friendId", messages);
chatRouter.post("/", send);

export default chatRouter;
