const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateAddToCart = (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid productId is required' });
  }

  if (quantity === undefined || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ success: false, message: 'Quantity must be an integer strictly greater than 0' });
  }

  next();
};

const validateUpdateCart = (req, res, next) => {
  const { quantity } = req.body;

  if (quantity === undefined || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ success: false, message: 'Quantity must be an integer strictly greater than 0' });
  }

  next();
};

module.exports = {
  validateAddToCart,
  validateUpdateCart,
};
