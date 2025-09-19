import {Router} from "express";
import {updateCoverPhoto} from "../../controllers/users/index.js";

const userRouter = Router();

userRouter.patch("/coverPhoto", updateCoverPhoto);


export default userRouter;