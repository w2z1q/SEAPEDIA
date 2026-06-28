const express = require('express');
const reviewController = require('../controllers/review.controller');
const reviewValidator = require('../validators/review.validator');
const { optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', reviewController.getReviews);
router.post('/', optionalAuth, reviewValidator.validateCreateReview, reviewController.createReview);

module.exports = router;
