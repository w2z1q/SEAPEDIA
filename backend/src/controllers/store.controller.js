const storeService = require('../services/store.service');

const createStore = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const store = await storeService.createStore(sellerId, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store
    });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ success: false, message: error.message });
    }
    console.error('Error creating store:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getMyStore = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const store = await storeService.getMyStore(sellerId);
    
    res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error fetching store:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createStore,
  getMyStore,
};
