const authService = require('../services/auth.service');

const test = (req, res) => {
  res.status(200).json({
    message: "Auth module is ready"
  });
};

const register = async (req, res) => {
  try {
    await authService.registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ message: error.message });
    }
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  test,
  register
};
