const VALID_STATUSES = ['SEDANG_DIKEMAS', 'MENUNGGU_PENGIRIM', 'DIKIRIM', 'SEDANG_DIKIRIM', 'SELESAI', 'DIBATALKAN', 'REFUND', 'DIKEMBALIKAN'];

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
      message: 'Invalid order status. Allowed values: SEDANG_DIKEMAS, MENUNGGU_PENGIRIM, DIKIRIM, SEDANG_DIKIRIM, SELESAI, DIBATALKAN, REFUND, DIKEMBALIKAN',
    });
  }

  next();
};

const VALID_DELIVERY_METHODS = ['INSTANT', 'NEXT_DAY', 'REGULAR'];

const validateCheckout = (req, res, next) => {
  const { deliveryMethod } = req.body;

  if (!deliveryMethod || typeof deliveryMethod !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'deliveryMethod is required and must be a string',
    });
  }

  if (!VALID_DELIVERY_METHODS.includes(deliveryMethod)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid deliveryMethod. Allowed values: INSTANT, NEXT_DAY, REGULAR',
    });
  }

  next();
};

module.exports = {
  validateUpdateOrderStatus,
  validateCheckout,
};
