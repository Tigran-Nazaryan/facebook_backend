import {User} from "../../models/models.js";

class PostsService {
    async findOrThrow(id) {
        const post = await Post.findByPk(id, {
            include: {
                model: User,
                as: "user",
            },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        return post;
    }

    async getAll() {
        return await Post.findAll({
            include: {
                model: User,
                as: "user",
            },
        });
    }

    async getById(id) {
        return await this.findOrThrow(id);
    }

    async create(body) {
        let user;

        if (body.userId) {
            user = await User.findByPk(body.userId);
        }

        if (!user && body.user) {
            user = await User.create({
                firstName: body.user.firstName,
                lastName: body.user.lastName,
                email: body.user.email,
                password: body.user.password,
            });
        }

        if (!user) {
            throw new Error("User not found or no user data provided");
        }

        const author = `${user.firstName} ${user.lastName}`;

        return await Post.create({
            title: body.title,
            body: body.body,
            avatar: body.avatar,
            author,
            userId: user.id,
        });
    }

    async update(id, updateData) {
        const post = await this.findOrThrow(id);
        await post.update(updateData);
        return post;
    }

    async delete(id) {
        const post = await this.findOrThrow(id);
        await post.destroy();
        return { message: "Post deleted successfully" };
    }

    async like(postId, userId) {
        const existingLike = await PostLike.findOne({
            where: { postId, userId },
        });

        if (existingLike) {
            throw new Error("Post already liked by this user");
        }

        const postExists = await Post.count({ where: { id: postId } });
        if (!postExists) {
            throw new Error("Post not found");
        }

        return await PostLike.create({ postId, userId });
    }

    async unlike(postId, userId) {
        const like = await PostLike.findOne({
            where: { postId, userId },
        });

        if (!like) {
            throw new Error("Like not found");
        }

        await like.destroy();

        return { message: "Like removed" };
    }
}

export default new PostsService();
