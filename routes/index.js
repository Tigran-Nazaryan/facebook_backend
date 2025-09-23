import {Router} from "express";
import authRouter from "./auth/index.js";
import postsRouter from "./post/index.js";
import authMiddleware from "../middleware/authMiddleware.js";
import profileRouter from "./profile/index.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/posts", authMiddleware, postsRouter);
router.use("/profile", authMiddleware, profileRouter);

export default router;