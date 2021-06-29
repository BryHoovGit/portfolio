const Joi = require('joi');

module.exports.developmentSchema = Joi.object({
    development: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        date: Joi.date().required(),
        gitUrl: Joi.string(),
        projectUrl: Joi.string()
    }).required(),
    deleteImages: Joi.array()
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

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required(),
});

module.exports.contactSchema = Joi.object({
    contact: Joi.object({
        name: Joi.string(),
        phoneNumber: Joi.number(),
        email: Joi.string().email(),
        subject: Joi.string(),
        message: Joi.string()
    }).required(),
});