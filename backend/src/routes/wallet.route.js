const express = require('express');
const walletController = require('../controllers/wallet.controller');
const walletValidator = require('../validators/wallet.validator');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken);
router.use(authorize('BUYER'));

router.get('/', walletController.getWallet);
router.post('/topup', walletValidator.validateTopUp, walletController.topUp);

module.exports = router;
