import { User } from "../../models/models.js";

export class UsersService {
    async updateCoverPhoto(userId, coverPhoto) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.coverPhoto = coverPhoto;
        await user.save();

        return user;
    }
}

export default new UsersService();
