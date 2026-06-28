const VALID_STATUSES = ['SEDANG_DIKEMAS', 'DIKIRIM', 'SEDANG_DIKIRIM', 'SELESAI'];

const validateUpdateOrderStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status || typeof status !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Status is required and must be a string',
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order status. Allowed values: SEDANG_DIKEMAS, DIKIRIM, SEDANG_DIKIRIM, SELESAI',
    });
  }

  next();
};

module.exports = {
  validateUpdateOrderStatus,
};
