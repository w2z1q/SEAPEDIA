const express = require('express');
const productController = require('../controllers/product.controller');
const productValidator = require('../validators/product.validator');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);

// Protected routes
router.get('/me', verifyToken, authorize('SELLER'), productController.getMyProducts);

// Public route (must be after /me)
router.get('/:id', productController.getPublicProductById);

// Protected routes for modifications
router.post('/', verifyToken, authorize('SELLER'), productValidator.validateCreateProduct, productController.createProduct);
router.put('/:id', verifyToken, authorize('SELLER'), productValidator.validateUpdateProduct, productController.updateProduct);
router.delete('/:id', verifyToken, authorize('SELLER'), productController.deleteProduct);

module.exports = router;
