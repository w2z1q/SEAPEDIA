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

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const orders = await orderService.getSellerOrders(sellerId);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const orderId = req.params.id;
    const { status } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(sellerId, orderId, status);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    if (error.status === 404 || error.status === 400) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getMyOrders(userId);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const orderDetail = await orderService.getOrderDetail(userId, orderId);

    res.status(200).json({
      success: true,
      data: orderDetail,
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error fetching order detail:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  checkout,
  getSellerOrders,
  updateOrderStatus,
  getMyOrders,
  getOrderDetail,
};
