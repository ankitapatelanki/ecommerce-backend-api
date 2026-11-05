
const express = require('express');

const {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
} = require('../controllers/cartController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addToCart);

router.get('/', authMiddleware, getCart);

router.put('/:itemId', authMiddleware, updateCartItem);

router.delete('/:itemId', authMiddleware, removeCartItem);

module.exports = router;
