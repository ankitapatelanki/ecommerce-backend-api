
const Joi = require('joi');

const createOrderSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().hex().length(24).required(),

                quantity: Joi.number().integer().min(1).required()
            })
        )
        .min(1)
        .required()
});

const updateOrderStatusSchema = Joi.object({
    orderStatus: Joi.string()
        .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
        .required()
});

module.exports = {
    createOrderSchema,
    updateOrderStatusSchema
};
