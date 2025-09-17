import Joi from "joi";

export const postSchema = Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
});