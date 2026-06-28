const express = require('express');
const productController = require('../controllers/product.controller');
const productValidator = require('../validators/product.validator');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken);
router.use(authorize('SELLER'));

router.post('/', productValidator.validateCreateProduct, productController.createProduct);
router.get('/me', productController.getMyProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productValidator.validateUpdateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
