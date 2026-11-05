
const express = require('express');

const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrder);

router.get('/my-orders', authMiddleware, getMyOrders);

router.get('/all', authMiddleware, adminMiddleware, getAllOrders);

router.get('/:id', authMiddleware, getOrderById);

router.patch('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
