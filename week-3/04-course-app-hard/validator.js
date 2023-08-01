const Joi = require('joi');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

//Schemas
const signUpSchema = Joi.object({
  username: Joi.string().required().max(20),
  password: Joi.string().required().min(6).max(120),
});

const courseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  imageLink: Joi.string().required(),
  published: Joi.boolean().required(),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
  imageLink: Joi.string().optional(),
  published: Joi.boolean().optional(),
});

module.exports = {
  validate,
  signUpSchema,
  courseSchema,
  updateCourseSchema,
};
