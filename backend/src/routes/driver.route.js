const express = require('express');
const driverController = require('../controllers/driver.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All driver routes protected by verifyToken and authorize('DRIVER')
router.use(verifyToken, authorize('DRIVER'));

router.get('/jobs/available', driverController.getAvailableJobs);
router.get('/jobs/my', driverController.getMyJobs);
router.get('/jobs/:jobId', driverController.getJobDetail);
router.post('/jobs/:orderId/take', driverController.takeJob);
router.put('/jobs/:jobId/complete', driverController.completeJob);
router.get('/earnings', driverController.getMyEarnings);

module.exports = router;
