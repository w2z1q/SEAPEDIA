const express = require('express');
const cartController = require('../controllers/cart.controller');
const cartValidator = require('../validators/cart.validator');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken);
router.use(authorize('BUYER'));

router.post('/', cartValidator.validateAddToCart, cartController.addToCart);
router.get('/', cartController.getMyCart);
router.put('/:id', cartValidator.validateUpdateCart, cartController.updateCartItem);
router.delete('/:id', cartController.deleteCartItem);

module.exports = router;
