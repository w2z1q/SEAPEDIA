const express = require('express');
const orderController = require('../controllers/order.controller');
const orderValidator = require('../validators/order.validator');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Wajib login untuk semua endpoint order
router.use(verifyToken);

// BUYER only - Checkout
router.post('/checkout', authorize('BUYER'), orderController.checkout);

// SELLER only - Daftar pesanan toko (Statik, diletakkan sebelum rute dinamis /:id)
router.get('/seller', authorize('SELLER'), orderController.getSellerOrders);

// BUYER only - Riwayat pesanan dan detail
router.get('/', authorize('BUYER'), orderController.getMyOrders);
router.get('/:id', authorize('BUYER'), orderController.getOrderDetail);

// SELLER only - Update status pesanan
router.put('/:id/status', authorize('SELLER'), orderValidator.validateUpdateOrderStatus, orderController.updateOrderStatus);

module.exports = router;
