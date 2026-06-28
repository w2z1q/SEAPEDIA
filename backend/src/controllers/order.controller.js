const orderService = require('../services/order.service');

const checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderData = await orderService.checkout(userId);

    res.status(201).json({
      success: true,
      data: {
        order: {
          id: orderData.id,
          userId: orderData.userId,
          storeId: orderData.storeId,
          addressId: orderData.addressId,
          voucherId: orderData.voucherId,
          promoId: orderData.promoId,
          status: orderData.status,
          subtotal: orderData.subtotal,
          shippingCost: orderData.shippingCost,
          tax: orderData.tax,
          discount: orderData.discount,
          total: orderData.total,
          createdAt: orderData.createdAt,
          updatedAt: orderData.updatedAt,
        },
        items: orderData.orderItems,
      },
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error('Error during checkout:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  checkout,
};
