const cartService = require('../services/cart.service');

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await cartService.addToCart(userId, req.body);

    if (result.isNew) {
      res.status(201).json({
        success: true,
        data: result.item,
      });
    } else {
      res.status(200).json({
        success: true,
        data: result.item,
      });
    }
  } catch (error) {
    if (error.status === 404 || error.status === 400 || error.status === 409) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartData = await cartService.getMyCart(userId);

    res.status(200).json({
      success: true,
      data: cartData,
    });
  } catch (error) {
    console.error('Error fetching my cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    const updatedItem = await cartService.updateCartItem(userId, cartItemId, quantity);

    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    if (error.status === 404 || error.status === 400) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error('Error updating cart item:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;

    const result = await cartService.deleteCartItem(userId, cartItemId);

    res.status(200).json(result);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error deleting cart item:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  addToCart,
  getMyCart,
  updateCartItem,
  deleteCartItem,
};
