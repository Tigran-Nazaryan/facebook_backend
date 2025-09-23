import {Like, Post, PostImage, sequelize, User} from "../../models/models.js";

class PostsService {
    async findOrThrow(id) {
        const post = await Post.findByPk(id, {
            include: [
                { model: User, as: "author", attributes: ['id', 'firstName', 'lastName'] },
                { model: PostImage, as: "images" }
            ]
        });

        if (!post) throw new Error("Post not found");
        return post;
    }

    async getAll() {
        return await Post.findAll({
            include: [
                { model: User, as: "author", attributes: ["id", "firstName", "lastName", "email", "coverPhoto", "isVerified", ] },
                { model: PostImage, as: "images", attributes: ["id", "postId", "imageUrl"] },
                {
                    model: Like,
                    as: "likes",
                    attributes: ["id", "userId", "postId"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "firstName", "lastName"],
                        },
                    ],
                },
            ]
        });
    }

    async getById(id) {
        return await this.findOrThrow(id);
    }

    async create(body, userId, files = []) {
        const title = (body.title || "").trim();
        if (!title) throw new Error("Title is required");

        let imagesFromUrls = [];
        if (body.images) {
            if (Array.isArray(body.images)) {
                imagesFromUrls = body.images.map(url => ({ imageUrl: url.trim() }));
            } else {
                imagesFromUrls = [{ imageUrl: body.images.trim() }];
            }
        }

        const imagesFromFiles = files.map(file => ({
            imageUrl: `/${file.filename}`,
        }));

        const allImages = [...imagesFromUrls, ...imagesFromFiles];

        return await sequelize.transaction(async (t) => {
            const post = await Post.create(
                {
                    title,
                    authorId: userId,
                    images: allImages,
                },
                {
                    include: [{ model: PostImage, as: "images" }],
                    transaction: t,
                }
            );

            await post.reload({
                include: [
                    { model: User, as: "author", attributes: ["id", "firstName", "lastName"] },
                    { model: PostImage, as: "images" },
                ],
                transaction: t,
            });

            return post;
        });
    }

    async update(id, updateData, files = []) {
        const post = await this.findOrThrow(id);

        if (updateData && Object.keys(updateData).length > 0) {
            await post.update(updateData);
        }

        if (files && files.length > 0) {
            const newImages = files.map(file => ({
                imageUrl: `/${file.filename}`,
                postId: id,
            }));

            await PostImage.destroy({ where: { postId: post.id } });
            await PostImage.bulkCreate(newImages);
        }

        return await post.reload({
            include: [
                { model: PostImage, as: 'images' },
                { model: User, as: 'author', attributes: ['firstName', 'lastName'] }
            ]
        });
    }

    async delete(id) {
        const post = await this.findOrThrow(id);
        await post.destroy();
        return { message: "Post deleted successfully" };
    }

    async like(postId, userId) {
        const existingLike = await Like.findOne({ where: { postId, userId } });
        if (existingLike) throw new Error("Post already liked by this profile");

        const postExists = await Post.count({ where: { id: postId } });
        if (!postExists) throw new Error("Post not found");

        await Like.create({ postId, userId });

        return {message: "Post liked"}
    }

    async unlike(postId, userId) {
        const like = await Like.findOne({ where: { postId, userId } });
        if (!like) throw new Error("Like not found");

        await like.destroy();
        return { message: "Like removed" };
    }
}

export default new PostsService();

