const validateCreateProduct = (req, res, next) => {
  const { name, description, price, stock } = req.body;

  if (!name || typeof name !== 'string' || name.length < 3) {
    return res.status(400).json({ success: false, message: 'Name is required and must be at least 3 characters long' });
  }

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ success: false, message: 'Description is required' });
  }

  if (price === undefined || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ success: false, message: 'Price is required and must be strictly greater than 0' });
  }

  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ success: false, message: 'Stock is required and must be greater than or equal to 0' });
  }

  next();
};

const validateUpdateProduct = (req, res, next) => {
  const { name, description, price, stock } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.length < 3)) {
    return res.status(400).json({ success: false, message: 'Name must be a string and at least 3 characters long' });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ success: false, message: 'Description must be a string' });
  }

  if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
    return res.status(400).json({ success: false, message: 'Price must be a number strictly greater than 0' });
  }

  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    return res.status(400).json({ success: false, message: 'Stock must be a number greater than or equal to 0' });
  }

  next();
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
};
