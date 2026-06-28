const express = require('express');
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/test', authController.test);
router.post('/register', authValidator.validateRegister, authController.register);
router.post('/login', authValidator.validateLogin, authController.login);
router.get('/profile', verifyToken, authController.profile);

module.exports = router;
