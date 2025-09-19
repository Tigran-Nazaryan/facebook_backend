import {Router} from "express";
import {
    create,
    getAll,
    getById,
    like,
    update,
    remove,
    unLike,
} from "../../controllers/posts/index.js";
import multerMiddleware from "../../middleware/multerMiddleware.js";

const postsRouter = Router();

postsRouter.post("/", multerMiddleware, create);
postsRouter.get('/', getAll);
postsRouter.get('/:id', getById);
postsRouter.put("/:id", multerMiddleware, update);
postsRouter.delete("/:id", remove);
postsRouter.post("/:postId/like", like);
postsRouter.delete("/:postId/like", unLike);

export default postsRouter;
