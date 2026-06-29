const adminService = require('../services/admin.service');
const overdueService = require('../services/overdue.service');

const getStats = async (req, res) => {
  try {
    const stats = await adminService.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const stores = await adminService.getStores();

    res.status(200).json({
      success: true,
      data: stores,
    });
  } catch (error) {
    console.error('Error fetching admin stores:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await adminService.getOrders();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getDriverJobs = async (req, res) => {
  try {
    const jobs = await adminService.getDriverJobs();

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Error fetching admin driver jobs:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await adminService.getProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getVouchers = async (req, res) => {
  try {
    const vouchers = await adminService.getVouchers();

    res.status(200).json({
      success: true,
      data: vouchers,
    });
  } catch (error) {
    console.error('Error fetching admin vouchers:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getPromos = async (req, res) => {
  try {
    const promos = await adminService.getPromos();

    res.status(200).json({
      success: true,
      data: promos,
    });
  } catch (error) {
    console.error('Error fetching admin promos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOverdueOrders = async (req, res) => {
  try {
    const orders = await adminService.getOverdueOrders();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching admin overdue orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const createVoucher = async (req, res) => {
  try {
    const voucher = await adminService.createVoucher(req.body);

    res.status(201).json({
      success: true,
      message: 'Voucher created successfully',
      data: voucher,
    });
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(error.status || 400).json({ success: false, message: error.message || 'Failed to create voucher' });
  }
};

const createPromo = async (req, res) => {
  try {
    const promo = await adminService.createPromo(req.body);

    res.status(201).json({
      success: true,
      message: 'Promo created successfully',
      data: promo,
    });
  } catch (error) {
    console.error('Error creating promo:', error);
    res.status(error.status || 400).json({ success: false, message: error.message || 'Failed to create promo' });
  }
};

const checkOverdue = async (req, res) => {
  try {
    const { simulatedDays } = req.body;
    const result = await overdueService.checkOverdueOrders(simulatedDays ? parseInt(simulatedDays, 10) : 0);

    res.status(200).json({
      success: true,
      message: 'Overdue orders checked successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error checking overdue orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getStats,
  getUsers,
  getStores,
  getOrders,
  getDriverJobs,
  getProducts,
  getVouchers,
  getPromos,
  getOverdueOrders,
  createVoucher,
  createPromo,
  checkOverdue,
};
