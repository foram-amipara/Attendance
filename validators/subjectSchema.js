const Joi=require("joi");

module.exports.subjectSchema=Joi.object({
    name: Joi.string().trim().required(),
    targetPercentage: Joi.number().min(0).max(100).default(75),
    weeklyLectures: Joi.number().min(0).default(0),
    weeklyLabs: Joi.number().min(0).default(0),
    priorLecturesConducted: Joi.number().min(0).default(0),
    priorLecturesPresent: Joi.number().min(0).default(0),
    priorLabsConducted: Joi.number().min(0).default(0),
    priorLabsPresent: Joi.number().min(0).default(0)
    
});

