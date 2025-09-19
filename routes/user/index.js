import {Router} from "express";
import { updatedata} from "../../controllers/users/index.js";

const userRouter = Router();

userRouter.patch("/", updatedata);


export default userRouter;