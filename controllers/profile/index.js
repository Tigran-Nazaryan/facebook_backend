import profileService from "../../service/profile/index.js";

export const userPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await profileService.userPosts(userId);
        res.status(200).json(posts);
    } catch (error) {
        const status = error.message.includes("not found") ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
};