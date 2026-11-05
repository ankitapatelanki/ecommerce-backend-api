
const express = require('express');

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.post('/', authMiddleware, adminMiddleware, createProduct);

router.put('/:id', authMiddleware, adminMiddleware, updateProduct);

router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
