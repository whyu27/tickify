const { pool } = require('../config/database');

const getSubscription = async (userId) => {
  const result = await pool.query(
    `SELECT subscription_plan, subscription_status, subscription_end_date
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
};

const upgradeSubscription = async (userId) => {
  const result = await pool.query(
    `UPDATE users
     SET subscription_plan = 'pro',
         subscription_status = 'active',
         subscription_end_date = NOW() + INTERVAL '30 days',
         updated_at = NOW()
     WHERE id = $1
     RETURNING subscription_plan, subscription_status, subscription_end_date`,
    [userId]
  );

  return result.rows[0];
};

module.exports = { getSubscription, upgradeSubscription };
