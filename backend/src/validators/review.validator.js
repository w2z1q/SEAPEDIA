const validateCreateReview = (req, res, next) => {
  const { guestName, rating, content } = req.body;

  if (!req.user) {
    if (!guestName || typeof guestName !== 'string' || guestName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'guestName is required for guest reviews and must be at least 2 characters long',
      });
    }
  }

  if (rating === undefined || typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'rating is required and must be an integer between 1 and 5',
    });
  }

  if (!content || typeof content !== 'string' || content.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'content is required and must be at least 10 characters long',
    });
  }

  next();
};

module.exports = {
  validateCreateReview,
};
