import { Post, User } from "../../models/models.js";

class PostsService {
    async findOrThrow(id) {
        const post = await Post.findByPk(id, {
            include: {
                model: User,
                as: "author",
            },
        });

        if (!post) throw new Error("Post not found");
        return post;
    }

    async getAll() {
        return await Post.findAll({
            include: {
                model: User,
                as: "author",
            },
        });
    }

    async getById(id) {
        return await this.findOrThrow(id);
    }

    async create(body, userId) {
        return await Post.create({
            title: body.title,
            body: body.body,
            avatar: body.avatar,
            authorId: userId,
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
        const existingLike = await PostLike.findOne({ where: { postId, userId } });
        if (existingLike) throw new Error("Post already liked by this user");

        const postExists = await Post.count({ where: { id: postId } });
        if (!postExists) throw new Error("Post not found");

        return await PostLike.create({ postId, userId });
    }

    async unlike(postId, userId) {
        const like = await PostLike.findOne({ where: { postId, userId } });
        if (!like) throw new Error("Like not found");

        await like.destroy();
        return { message: "Like removed" };
    }
}

export default new PostsService();
