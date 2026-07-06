const { getAllCategories } = require('../services/categoryService');

const getAll = async (req, res) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { getAll };
