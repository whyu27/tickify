const { pool } = require('../config/database');

const createEvent = async (organizerId, data) => {
  const { title, description, location, event_date, banner_url, price_eth, quota } = data;

  const result = await pool.query(
    `INSERT INTO events (organizer_id, title, description, location, event_date, banner_url, price_eth, quota)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, organizer_id, title, description, location, event_date, banner_url, price_eth, quota, tickets_sold, status, created_at`,
    [organizerId, title, description, location, event_date, banner_url || null, price_eth, quota]
  );

  return result.rows[0];
};

const getOrganizerEvents = async (organizerId) => {
  const result = await pool.query(
    `SELECT id, organizer_id, title, description, location, event_date, banner_url, price_eth, quota, tickets_sold, status, created_at
     FROM events
     WHERE organizer_id = $1
     ORDER BY event_date ASC`,
    [organizerId]
  );

  return result.rows;
};

const getAllEvents = async () => {
  const result = await pool.query(
    `SELECT id, title, description, location, event_date, price_eth, quota, banner_url, status
     FROM events
     WHERE status = 'published'
     ORDER BY event_date ASC`
  );

  return result.rows;
};

module.exports = { createEvent, getOrganizerEvents, getAllEvents };
