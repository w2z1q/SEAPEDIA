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
router.get('/products', adminController.getProducts);
router.get('/vouchers', adminController.getVouchers);
router.get('/promos', adminController.getPromos);
router.get('/overdue-orders', adminController.getOverdueOrders);
router.post('/vouchers', adminController.createVoucher);
router.post('/promos', adminController.createPromo);
router.delete('/vouchers/:id', adminController.deleteVoucher);
router.delete('/promos/:id', adminController.deletePromo);
router.post('/overdue/check', adminController.checkOverdue);

module.exports = router;
