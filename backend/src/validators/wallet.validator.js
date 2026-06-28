const validateTopUp = (req, res, next) => {
  const { amount } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({
      success: false,
      message: 'Amount is required',
    });
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a valid number',
    });
  }

  if (amount < 1000) {
    return res.status(400).json({
      success: false,
      message: 'Minimum top up amount is 1000',
    });
  }

  next();
};

module.exports = {
  validateTopUp,
};
