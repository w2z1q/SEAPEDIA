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
      success: true,
      message: "User registered successfully",
      data: {}
    });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ success: false, message: error.message });
    }
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    if (error.status === 401) {
      return res.status(401).json({ success: false, message: error.message });
    }
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  test,
  register,
  login
};
