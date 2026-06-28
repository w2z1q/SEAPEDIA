const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All admin routes protected by verifyToken and authorize('ADMIN')
router.use(verifyToken, authorize('ADMIN'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/stores', adminController.getStores);
router.get('/orders', adminController.getOrders);
router.get('/driver-jobs', adminController.getDriverJobs);

module.exports = router;
