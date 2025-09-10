import AuthService from "../../service/auth"
import {User} from "../../../models/models";

export const registration = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const userData = await AuthService.registration(email, password, firstName, lastName);
        return res.json(userData);
    } catch (e) {
        next(e);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await AuthService.login(email, password);
        return res.json(userData);
    } catch (e) {
        next(e);
    }
};

export const logout = async (req, res, next) => {
    try {
        await AuthService.logout(req)

        res.clearCookie("accessToken", {
            httpOnly: true,

        });

        return res.json({message: "User logged out successfully"});
    } catch (e) {
        next(e);
    }

    export const verify = async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id, {attributes: ["id"]});
            if (!user) {
                return res.status(404).json({error: "User not found"});
            }
            res.json({user});
        } catch (err) {
            res.status(500).json({error: "Server error"});
        }
    }
}