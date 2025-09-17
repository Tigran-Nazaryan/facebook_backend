import jwt from "jsonwebtoken";

class TokenService {
    generateAccessToken(payload) {
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "15d",
        });
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch {
            return null;
        }
    }
}

export default new TokenService();
