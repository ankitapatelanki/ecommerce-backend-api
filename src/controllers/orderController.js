
const mongoose = require('mongoose');

const Order = require('../models/orderModels');
const Product = require('../models/productModels');

const {
    createOrderSchema,
    updateOrderStatusSchema
} = require('../validators/orderValidator');

const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { error, value } = createOrderSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        let createdOrder;

        await session.withTransaction(async () => {
            const orderItems = [];
            let totalAmount = 0;

            for (const item of value.items) {
                const product = await Product.findById(item.productId).session(session);

                if (!product) {
                    throw new Error('PRODUCT_NOT_FOUND');
                }

                if (product.stock < item.quantity) {
                    throw new Error('INSUFFICIENT_STOCK');
                }

                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        _id: item.productId,
                        stock: { $gte: item.quantity }
                    },
                    {
                        $inc: { stock: -item.quantity }
                    },
                    {
                        new: true,
                        session
                    }
                );

                if (!updatedProduct) {
                    throw new Error('INSUFFICIENT_STOCK');
                }

                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price
                });

                totalAmount += product.price * item.quantity;
            }

            const orders = await Order.create(
                [
                    {
                        user: req.user._id,
                        items: orderItems,
                        totalAmount
                    }
                ],
                { session }
            );

            createdOrder = orders[0];
        });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: createdOrder
        });
    } catch (error) {
        if (error.message === 'PRODUCT_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (error.message === 'INSUFFICIENT_STOCK') {
            return res.status(400).json({
                success: false,
                message: 'Insufficient product stock'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        await session.endSession();
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).populate('items.product');

        return res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order fetched successfully',
            data: order
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid order ID'
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product');

        return res.status(200).json({
            success: true,
            message: 'All orders fetched successfully',
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { error, value } = updateOrderStatusSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: value.orderStatus },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid order ID or data'
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
