const walletService = require('../services/wallet.service');

const getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const walletData = await walletService.getWallet(userId);

    res.status(200).json({
      success: true,
      data: walletData,
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const topUp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    const result = await walletService.topUp(userId, amount);

    res.status(200).json({
      success: true,
      message: 'Top up successful',
      data: result,
    });
  } catch (error) {
    console.error('Error during top up:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getWallet,
  topUp,
};
