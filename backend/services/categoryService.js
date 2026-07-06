const { pool } = require('../config/database');

const getAllCategories = async () => {
  const result = await pool.query('SELECT id, name, slug FROM categories ORDER BY id ASC');
  return result.rows;
};

module.exports = { getAllCategories };
