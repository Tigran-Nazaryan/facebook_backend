import Joi from 'joi';

export const registrationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  birthday: Joi.date().iso().optional(),
  gender: Joi.string().valid("male", "female").optional()
});
