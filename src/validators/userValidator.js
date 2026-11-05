const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),

    email: Joi.string().trim().email().lowercase().required(),

    password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
    email: Joi.string().trim().email().lowercase().required(),

    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};