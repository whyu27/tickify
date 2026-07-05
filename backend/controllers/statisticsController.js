const { getStatistics } = require('../services/statisticsService');

const getStatisticsHandler = async (req, res) => {
  try {
    const statistics = await getStatistics();

    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { getStatistics: getStatisticsHandler };
