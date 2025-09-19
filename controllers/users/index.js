import UsersService from "../../service/user/index.js";

export const updateCoverPhoto = async (req, res) => {
    try {
        const userId = req.user.id;
        const { coverPhoto } = req.body;

        const updatedUser = await UsersService.updateCoverPhoto(userId, coverPhoto);

        res.json({
            message: "Cover photo updated successfully",
            coverPhoto: updatedUser.coverPhoto,
        });
    } catch (err) {
        console.error("Error updating cover photo:", err);
        res.status(500).json({ message: "Server error" });
    }
};
