const Joi=require("joi");

module.exports.signupSchema=Joi.object({
    username: Joi.string().trim().min(3).required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).required(),
});

module.exports.loginSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().required(),
});
