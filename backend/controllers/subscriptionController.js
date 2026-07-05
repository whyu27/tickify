const { getSubscription, upgradeSubscription } = require('../services/subscriptionService');

const getSubscriptionHandler = async (req, res) => {
  try {
    const subscription = await getSubscription(req.user.id);

    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const upgrade = async (req, res) => {
  try {
    const subscription = await upgradeSubscription(req.user.id);

    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { getSubscription: getSubscriptionHandler, upgrade };
