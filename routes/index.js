import {Router} from "express";
import authRouter from "./auth/index.js";
import postsRouter from "./post/index.js";
import authMiddleware from "../middleware/authMiddleware.js";
import profileRouter from "./profile/index.js";
import friendRouter from "./friend/index.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/posts", authMiddleware, postsRouter);
router.use("/profile", authMiddleware, profileRouter);
router.use("/friends", authMiddleware, friendRouter);

export default router;