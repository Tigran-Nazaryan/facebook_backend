import postsService from "../../service/post/index.js";
import { postSchema } from "../../validations/posts/index.js";

export const getAll = async (req, res) => {
    try {
        const result = await postsService.getAll();
        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getById = async (req, res) => {
    try {
        const post = await postsService.getById(req.params.id);
        return res.status(200).json({ data: post });
    } catch (error) {
        res.status(error.message === "Post not found" ? 404 : 500).json({ message: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const { body, user } = req;

        const { error } = postSchema.validate(body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const post = await postsService.create(body, user.id);

        return res.status(201).json(post);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

export const update = async (req, res) => {
    try {
        const post = await postsService.getById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.authorId !== req.user.id) {
            return res.status(403).json({ message: "You are not the author" });
        }

        const updatedPost = await postsService.update(req.params.id, req.body);
        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const post = await postsService.getById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.authorId !== req.user.id) {
            return res.status(403).json({ message: "You are not the author" });
        }

        const result = await postsService.delete(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const like = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const like = await postsService.like(postId, userId);
        return res.status(201).json(like);
    } catch (error) {
        const status = error.message.includes("already liked") ? 409 : 400;
        res.status(status).json({ message: error.message });
    }
};

export const unLike = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const result = await postsService.unlike(postId, userId);
        res.status(200).json(result);
    } catch (error) {
        const status = error.message.includes("not found") ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
};
