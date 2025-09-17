import {Router} from "express";
import {
    forgotPasswordMail,
    login,
    logout,
    registration, resetPassword,
    verify,
    verifyEmail
} from "../../controllers/auth/index.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", registration);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/verify", authMiddleware, verify);
authRouter.put("/verify/:token", verifyEmail);
authRouter.post("/forgotPassword", forgotPasswordMail);
authRouter.post("/resetPassword", resetPassword);

export default authRouter;
