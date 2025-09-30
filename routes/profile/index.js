import {Router} from "express";
import {
    getProfile,
    removeCoverPhoto,
    updateCoverPhoto,
    updateProfile,
    userPosts
} from "../../controllers/profile/index.js";
import {uploadCoverPhoto} from "../../middleware/singleCoverUpload.js";

const profileRouter = Router();

profileRouter.get("/", getProfile);
profileRouter.get("/posts", userPosts);
profileRouter.put("/", updateProfile);
profileRouter.put("/coverPhoto", uploadCoverPhoto, updateCoverPhoto);
profileRouter.delete("/coverPhoto", removeCoverPhoto);


export default profileRouter;