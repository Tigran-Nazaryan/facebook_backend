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

export const getProfile = async (req, res) => {
    try {
        const user = await profileService.getProfile(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await profileService.updateProfile(req.user.id, req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateCoverPhoto = async (req, res) => {
    try {
        const userId = req.user.id;
        const filePath = req.file.filename;

        const user = await profileService.updateCoverPhoto(userId, filePath);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const removeCoverPhoto = async (req, res) => {
    try {
        const user = await profileService.removeCoverPhoto(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
