import AuthService from "../../service/auth/index.js"

export const registration = async (req, res, next) => {
    console.log(req.body);
    try {
        const { email, password, firstName, lastName, birthday, gender } = req.body;

        const userData = await AuthService.registration(email, password, firstName, lastName, birthday, gender);
        return res.json(userData);
    } catch (e) {
        next(e);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await AuthService.login(email, password);
        console.log("Controller login response:", userData);
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

        return res.json({ message: "User logged out successfully" });
    } catch (e) {
        next(e);
    }
}

export const verify = async (req, res) => {
    try {
        const user = await AuthService.verify(req.user.id);

        res.json({ user });
    } catch (err) {
        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "Server error" });
    }
};
