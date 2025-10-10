import {Router} from "express";
import {messages} from "../../controllers/chat/index.js";

const chatRouter = Router();

chatRouter.get("/:userId/:friendId", messages);

export default chatRouter;
