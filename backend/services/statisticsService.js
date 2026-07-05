const { pool } = require('../config/database');

const getStatistics = async () => {
  const activeEventsResult = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM events
     WHERE status = 'published'`
  );

  const ticketsResult = await pool.query(
    `SELECT COALESCE(SUM(quota - tickets_sold), 0)::int AS total
     FROM events
     WHERE status = 'published'`
  );

  return {
    activeEvents: activeEventsResult.rows[0].count,
    ticketsAvailable: ticketsResult.rows[0].total,
    platformStatus: 'Active',
  };
};

module.exports = { getStatistics };
