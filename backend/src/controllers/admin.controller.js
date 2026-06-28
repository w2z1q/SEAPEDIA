const adminService = require('../services/admin.service');

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

module.exports = {
  getStats,
  getUsers,
  getStores,
  getOrders,
  getDriverJobs,
};
