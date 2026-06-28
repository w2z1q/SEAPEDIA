const express = require('express');
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');

const router = express.Router();

router.get('/test', authController.test);
router.post('/register', authValidator.validateRegister, authController.register);

module.exports = router;
