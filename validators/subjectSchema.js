const Joi=require("joi");

module.exports.subjectSchema=Joi.object({
    name: Joi.string().trim().required(),
    targetPercentage: Joi.number().min(0).max(100).default(75),
    weeklyLectures: Joi.number().min(0).default(0),
    weeklyLabs: Joi.number().min(0).default(0),
    
});

