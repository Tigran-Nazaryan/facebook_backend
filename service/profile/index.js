import {Post, User, Like, PostImage} from "../../models/models.js";

class ProfileService {
    async userPosts(userId) {
        const userExists = await User.count({where: {id: userId}});
        if (!userExists) throw new Error("User not found");

        return await Post.findAll({
            where: {authorId: userId},
            include: [
                {
                    model: User,
                    as: "author",
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "isVerified",
                        "coverPhoto",
                        "email"
                    ]
                },
                {
                    model: PostImage,
                    as: "images",
                    attributes: ["id", "postId", "imageUrl"]
                },
                {
                    model: Like,
                    as: "likes",
                    attributes: ["id", "userId", "postId"],
                }
            ],
            order: [["createdAt", "DESC"]]
        });
    };

    async getProfile(userId) {
        const user = await User.findByPk(userId, {
            attributes: ["id", "firstName", "lastName", "email", "coverPhoto", "createdAt"]
        });
        if (!user) throw new Error("User not found");
        return user;
    }

    async updateProfile(userId, data) {
        const user = await User.findByPk(userId, {
            attributes: ["id", "firstName", "lastName", "email", "coverPhoto", "createdAt", "updatedAt"]
        });
        if (!user) throw new Error("User not found");

        const allowedFields = ['firstName', 'lastName', 'email', 'coverPhoto'];
        const updateData = {};

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        }

        await user.update(updateData);
        return user;
    }

    async updateCoverPhoto(userId, coverPhoto) {
        return this.updateProfile(userId, { coverPhoto });
    }

    async removeCoverPhoto(userId) {
        return this.updateProfile(userId, { coverPhoto: null });
    }
}

export default new ProfileService();