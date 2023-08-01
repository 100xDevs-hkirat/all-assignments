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
  username: Joi.string()
    .required()
    .max(20)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .message('Username must contains only alphnumeric characters and _'),
  password: Joi.string()
    .required()
    .min(6)
    .max(120)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/
    )
    .message(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
    ),
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
