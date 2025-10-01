import {Router} from "express";
import {users} from "../../controllers/search/index.js";

const searchRouter = Router();

searchRouter.get("/users", users);

export default searchRouter;