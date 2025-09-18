import AuthService from "../../service/auth/index.js"
import jwt from "jsonwebtoken";

export const registration = async (req, res, next) => {
    try {
        const {email, password, firstName, lastName, birthday, gender} = req.body;

        const userData = await AuthService.registration(email, password, firstName, lastName, birthday, gender);
        return res.json(userData);
    } catch (e) {
        next(e);
    }
};

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const userData = await AuthService.login(email, password);
        return res.json(userData);
    } catch (e) {
        next(e);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            path: "/",
        });

        return res.json({message: "User logged out successfully"});
    } catch (e) {
        next(e);
    }
}

export const verify = async (req, res) => {
    try {
        const user = await AuthService.verify(req.user.id);

        res.json({user});
    } catch (err) {
        if (err.message === "User not found") {
            return res.status(404).json({error: err.message});
        }
        res.status(500).json({error: "Server error"});
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const {token} = req.params;
        const result = await AuthService.verifyEmail(token);
        return res.json(result);
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
};

export const forgotPasswordMail = async (req, res) => {
    try {
        const {email} = req.body;

        const resetToken = jwt.sign({email: email}, process.env.JWT_ACCESS_SECRET, {expiresIn: "30m"});
        await AuthService.sendForgotPasswordMail(email, resetToken);

        res.status(200).json({message: "Reset link sent to email"});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        const result = await AuthService.resetPasswordService(token, newPassword);

        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};