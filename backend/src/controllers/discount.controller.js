const discountService = require('../services/discount.service');

const createVoucher = async (req, res) => {
  try {
    const voucher = await discountService.createVoucher(req.body);

    res.status(201).json({
      success: true,
      message: 'Voucher created successfully',
      data: voucher,
    });
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const createPromo = async (req, res) => {
  try {
    const promo = await discountService.createPromo(req.body);

    res.status(201).json({
      success: true,
      message: 'Promo created successfully',
      data: promo,
    });
  } catch (error) {
    console.error('Error creating promo:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getVouchers = async (req, res) => {
  try {
    const vouchers = await discountService.getVouchers();

    res.status(200).json({
      success: true,
      data: vouchers,
    });
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getPromos = async (req, res) => {
  try {
    const promos = await discountService.getPromos();

    res.status(200).json({
      success: true,
      data: promos,
    });
  } catch (error) {
    console.error('Error fetching promos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createVoucher,
  createPromo,
  getVouchers,
  getPromos,
};
