const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const validateCreateVoucher = async (req, res, next) => {
  const { code, discount, expiry, usageLimit } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Code is required and must be a string',
    });
  }

  try {
    const existingVoucher = await prisma.voucher.findUnique({ where: { code } });
    if (existingVoucher) {
      return res.status(400).json({
        success: false,
        message: 'Voucher code already exists',
      });
    }
  } catch (error) {
    console.error('Error checking voucher code:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }

  if (discount === undefined || typeof discount !== 'number' || discount < 0 || discount > 100) {
    return res.status(400).json({
      success: false,
      message: 'Discount is required and must be a number between 0 and 100',
    });
  }

  if (!expiry || isNaN(Date.parse(expiry)) || new Date(expiry) <= new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Expiry is required and must be a valid future date',
    });
  }

  if (usageLimit === undefined || typeof usageLimit !== 'number' || !Number.isInteger(usageLimit) || usageLimit < 1) {
    return res.status(400).json({
      success: false,
      message: 'Usage limit is required and must be an integer of at least 1',
    });
  }

  next();
};

const validateCreatePromo = (req, res, next) => {
  const { name, discount, expiry, storeId } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be a string',
    });
  }

  if (discount === undefined || typeof discount !== 'number' || discount < 0 || discount > 100) {
    return res.status(400).json({
      success: false,
      message: 'Discount is required and must be a number between 0 and 100',
    });
  }

  if (!expiry || isNaN(Date.parse(expiry)) || new Date(expiry) <= new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Expiry is required and must be a valid future date',
    });
  }

  if (!storeId || typeof storeId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'storeId is required and must be a valid string',
    });
  }

  next();
};

module.exports = {
  validateCreateVoucher,
  validateCreatePromo,
};
