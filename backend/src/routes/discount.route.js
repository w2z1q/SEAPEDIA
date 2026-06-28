const express = require('express');
const discountController = require('../controllers/discount.controller');
const discountValidator = require('../validators/discount.validator');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const voucherRouter = express.Router();
const promoRouter = express.Router();

// Vouchers
voucherRouter.get('/', discountController.getVouchers);
voucherRouter.post('/', verifyToken, authorize('ADMIN'), discountValidator.validateCreateVoucher, discountController.createVoucher);

// Promos
promoRouter.get('/', discountController.getPromos);
promoRouter.post('/', verifyToken, authorize('ADMIN'), discountValidator.validateCreatePromo, discountController.createPromo);

module.exports = {
  voucherRouter,
  promoRouter,
};
