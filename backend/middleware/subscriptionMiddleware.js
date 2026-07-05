const { pool } = require('../config/database');

const checkFreePlanLimit = async (req, res, next) => {
  try {
    const subResult = await pool.query(
      'SELECT subscription_plan FROM users WHERE id = $1',
      [req.user.id]
    );

    if (subResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (subResult.rows[0].subscription_plan === 'pro') {
      return next();
    }

    const eventCount = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM events
       WHERE organizer_id = $1
         AND status IN ('draft', 'published')`,
      [req.user.id]
    );

    if (eventCount.rows[0].count >= 2) {
      return res.status(403).json({
        success: false,
        message: 'Free plan limit reached. Upgrade to Pro.',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { checkFreePlanLimit };
