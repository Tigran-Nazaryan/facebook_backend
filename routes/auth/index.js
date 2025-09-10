import {Router} from "express";
import {login, logout, registration, verify} from "../../controllers/auth/index.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", registration);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/verify", authMiddleware, verify);

export default authRouter;
