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

const postsRouter = Router();

postsRouter.post("/", create);
postsRouter.get('/', getAll);
postsRouter.get('/:id', getById);
postsRouter.put("/:id", update);
postsRouter.delete("/:id", remove);
postsRouter.post("/:postId/like", like);
postsRouter.delete("/:postId/like", unLike);

export default postsRouter;