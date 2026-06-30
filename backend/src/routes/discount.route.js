const express = require('express');
const discountController = require('../controllers/discount.controller');
const discountValidator = require('../validators/discount.validator');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const voucherRouter = express.Router();
const promoRouter = express.Router();

// Vouchers
voucherRouter.get('/', discountController.getVouchers);
voucherRouter.post('/validate', discountController.validateVoucher);
voucherRouter.post('/', verifyToken, authorize('ADMIN'), discountValidator.validateCreateVoucher, discountController.createVoucher);
voucherRouter.delete('/:id', verifyToken, authorize('ADMIN'), discountController.deleteVoucher);

// Promos
promoRouter.get('/', discountController.getPromos);
promoRouter.post('/', verifyToken, authorize('ADMIN'), discountValidator.validateCreatePromo, discountController.createPromo);
promoRouter.delete('/:id', verifyToken, authorize('ADMIN'), discountController.deletePromo);

module.exports = {
  voucherRouter,
  promoRouter,
};
