const Joi = require('joi');

module.exports.resumeSchema = Joi.object({
    resume: Joi.object({
        name: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        email: Joi.string().email().required(),
    }).required()
});

module.exports.photoSchema = Joi.object({
    photo: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.designSchema = Joi.object({
    design: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        date: Joi.date().required(),
        category: Joi.string()
    }).required(),
    deleteImages: Joi.array()
});