const validateCreateStore = (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ success: false, message: 'Store name is required' });
  }

  if (name.length < 3) {
    return res.status(400).json({ success: false, message: 'Store name must be at least 3 characters long' });
  }

  if (name.length > 100) {
    return res.status(400).json({ success: false, message: 'Store name must be at most 100 characters long' });
  }

  next();
};

module.exports = {
  validateCreateStore,
};
