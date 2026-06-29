const express = require('express');
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

const router = express.Router();

router.get('/test', authController.test);
router.post('/register', authLimiter, authValidator.validateRegister, authController.register);
router.post('/login', authLimiter, authValidator.validateLogin, authController.login);
router.get('/profile', verifyToken, authController.profile);
router.post('/address', verifyToken, authController.addAddress);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
