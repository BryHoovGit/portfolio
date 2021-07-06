const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.developmentSchema = Joi.object({
    development: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        date: Joi.date().required(),
        gitUrl: Joi.string().escapeHTML(),
        projectUrl: Joi.string().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.photoSchema = Joi.object({
    photo: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        date: Joi.date().required(),
        location: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.designSchema = Joi.object({
    design: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        date: Joi.date().required(),
        category: Joi.string().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required(),
});

module.exports.contactSchema = Joi.object({
    contact: Joi.object({
        phone: Joi.string().min(10).max(14).pattern(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/).required().escapeHTML(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'gov', 'edu'] } }).required().escapeHTML(),
        subject: Joi.string().required().escapeHTML().max(41),
        message: Joi.string().required().escapeHTML()
    }).required(),
});