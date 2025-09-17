import {Router} from "express";
import authRouter from "./auth/index.js";
import postsRouter from "./post/index.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/posts", authMiddleware, postsRouter);

export default router;