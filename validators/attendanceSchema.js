const Joi=require("joi");

module.exports.attendanceSchema=Joi.object({
    subjectId: Joi.string().hex().length(24).required(),
    type:Joi.string().valid("LECTURE","LAB").required(),
    status:Joi.string().valid("PRESENT","ABSENT","CANCELLED").required(),
    date:Joi.date().iso().optional(),
});

