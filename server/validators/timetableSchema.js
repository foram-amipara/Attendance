const Joi = require("joi");

const slotSchema = Joi.object({
    subjectId: Joi.string().hex().length(24).required(),
    type: Joi.string().valid("LECTURE", "LAB").required(),
    order: Joi.number().required()
});

module.exports.timetableSchema = Joi.object({
    monday: Joi.array().items(slotSchema),
    tuesday: Joi.array().items(slotSchema),
    wednesday: Joi.array().items(slotSchema),
    thursday: Joi.array().items(slotSchema),
    friday: Joi.array().items(slotSchema)
});

module.exports.overrideSchema = Joi.object({
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(), // YYYY-MM-DD
    slots: Joi.array().items(slotSchema).required()
});
