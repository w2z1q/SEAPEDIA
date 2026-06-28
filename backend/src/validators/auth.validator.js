const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  if (password.length > 100) {
    return res.status(400).json({ message: 'Password must be at most 100 characters long' });
  }

  next();
};

module.exports = {
  validateRegister,
};
