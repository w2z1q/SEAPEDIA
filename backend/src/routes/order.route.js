const express = require('express');
const orderController = require('../controllers/order.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken);
router.use(authorize('BUYER'));

router.post('/checkout', orderController.checkout);

module.exports = router;
