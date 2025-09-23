import {Post, User, Like, PostImage} from "../../models/models.js";

class ProfileService {
    async userPosts(userId) {
        const userExists = await User.count({where: {id: userId}});
        if (!userExists) throw new Error("User not found");

        return await Post.findAll({
            where: { authorId: userId },
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
    }
}

export default new ProfileService();