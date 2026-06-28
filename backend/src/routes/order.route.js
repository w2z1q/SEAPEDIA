const express = require('express');
const orderController = require('../controllers/order.controller');
const orderValidator = require('../validators/order.validator');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Wajib login untuk semua endpoint order
router.use(verifyToken);

// BUYER only
router.post('/checkout', authorize('BUYER'), orderController.checkout);

// SELLER only
router.get('/seller', authorize('SELLER'), orderController.getSellerOrders);
router.put('/:id/status', authorize('SELLER'), orderValidator.validateUpdateOrderStatus, orderController.updateOrderStatus);

module.exports = router;
