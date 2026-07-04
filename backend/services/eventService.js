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

const getEventById = async (id) => {
  const result = await pool.query(
    `SELECT id, title, description, location, event_date, price_eth, quota, banner_url, status, created_at
     FROM events
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const updateEvent = async (eventId, organizerId, data) => {
  const event = await pool.query(
    'SELECT organizer_id FROM events WHERE id = $1',
    [eventId]
  );

  if (event.rows.length === 0) {
    throw new Error('Event not found');
  }

  if (event.rows[0].organizer_id !== organizerId) {
    throw new Error('Forbidden');
  }

  const { title, description, location, event_date, banner_url, price_eth, quota } = data;

  const result = await pool.query(
    `UPDATE events
     SET title = $1, description = $2, location = $3, event_date = $4,
         price_eth = $5, quota = $6, banner_url = $7, updated_at = NOW()
     WHERE id = $8
     RETURNING id, title, description, location, event_date, price_eth, quota, banner_url, status`,
    [title, description || null, location, event_date, price_eth, quota, banner_url || null, eventId]
  );

  return result.rows[0];
};

const deleteEvent = async (eventId, organizerId) => {
  const event = await pool.query(
    'SELECT organizer_id FROM events WHERE id = $1',
    [eventId]
  );

  if (event.rows.length === 0) {
    throw new Error('Event not found');
  }

  if (event.rows[0].organizer_id !== organizerId) {
    throw new Error('Forbidden');
  }

  await pool.query('DELETE FROM events WHERE id = $1', [eventId]);
};

module.exports = { createEvent, getOrganizerEvents, getAllEvents, getEventById, updateEvent, deleteEvent };
