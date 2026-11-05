
const Cart = require('../models/cartModels');
const Product = require('../models/productModels');

const {
    addToCartSchema,
    updateCartSchema
} = require('../validators/cartValidator');

const addToCart = async (req, res) => {
    try {
        const { error, value } = addToCartSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { productId, quantity } = value;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient product stock'
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity }]
            });
        } else {
            const existingItem = cart.items.find(
                item => item.product.toString() === productId
            );

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;

                if (newQuantity > product.stock) {
                    return res.status(400).json({
                        success: false,
                        message: 'Insufficient product stock'
                    });
                }

                existingItem.quantity = newQuantity;
            } else {
                cart.items.push({
                    product: productId,
                    quantity
                });
            }

            await cart.save();
        }

        await cart.populate('items.product');

        return res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');

        return res.status(200).json({
            success: true,
            message: 'Cart fetched successfully',
            data: cart || { items: [] }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { error, value } = updateCartSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const item = cart.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        const product = await Product.findById(item.product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (value.quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient product stock'
            });
        }

        item.quantity = value.quantity;

        await cart.save();
        await cart.populate('items.product');

        return res.status(200).json({
            success: true,
            message: 'Cart item updated successfully',
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const item = cart.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        item.deleteOne();

        await cart.save();

        return res.status(200).json({
            success: true,
            message: 'Cart item removed successfully',
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
};
