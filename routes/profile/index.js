import {Router} from "express";
import { userPosts} from "../../controllers/profile/index.js";

const profileRouter = Router();

profileRouter.get("/posts", userPosts);


export default profileRouter;