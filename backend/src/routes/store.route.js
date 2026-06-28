const express = require('express');
const storeController = require('../controllers/store.controller');
const storeValidator = require('../validators/store.validator');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken);
router.use(authorize('SELLER'));

router.post('/', storeValidator.validateCreateStore, storeController.createStore);
router.get('/me', storeController.getMyStore);

module.exports = router;
