const reviewService = require('../services/review.service');

const createReview = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const reviewData = await reviewService.createReview(req.body, userId);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: reviewData,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getReviews();

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getProductReviews(req.params.id);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createReview,
  getReviews,
  getProductReviews,
};
