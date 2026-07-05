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
    `SELECT e.id, e.title, e.description, e.location, e.event_date, e.price_eth, e.quota, e.tickets_sold, e.banner_url, e.status, u.name AS organizer_name
     FROM events e
     JOIN users u ON e.organizer_id = u.id
     WHERE e.status = 'published'
     ORDER BY e.event_date ASC`
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

  // Build SET clause dynamically based on provided fields
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  // Always update these core fields
  setClauses.push(`title = $${paramIndex++}`);
  values.push(title);

  setClauses.push(`description = $${paramIndex++}`);
  values.push(description || null);

  setClauses.push(`location = $${paramIndex++}`);
  values.push(location);

  setClauses.push(`event_date = $${paramIndex++}`);
  values.push(event_date);

  setClauses.push(`price_eth = $${paramIndex++}`);
  values.push(price_eth);

  setClauses.push(`quota = $${paramIndex++}`);
  values.push(quota);

  // Only update banner_url if explicitly provided (even if null)
  if (data.hasOwnProperty('banner_url')) {
    setClauses.push(`banner_url = $${paramIndex++}`);
    values.push(banner_url || null);
  }

  setClauses.push(`updated_at = NOW()`);

  // Add eventId as the final parameter for WHERE clause
  values.push(eventId);

  const query = `
    UPDATE events
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, title, description, location, event_date, price_eth, quota, banner_url, status
  `;

  const result = await pool.query(query, values);

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

const countActiveEvents = async (organizerId) => {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM events
     WHERE organizer_id = $1
       AND status IN ('draft', 'published')`,
    [organizerId]
  );

  return result.rows[0].count;
};

const updateEventStatus = async (eventId, organizerId, status) => {
  // Validate status
  const validStatuses = ['draft', 'published', 'closed'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  // Check if event exists and belongs to organizer
  const event = await pool.query(
    'SELECT organizer_id, status FROM events WHERE id = $1',
    [eventId]
  );

  if (event.rows.length === 0) {
    throw new Error('Event not found');
  }

  if (event.rows[0].organizer_id !== organizerId) {
    throw new Error('Forbidden');
  }

  // Update status
  const result = await pool.query(
    `UPDATE events
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, title, description, location, event_date, price_eth, quota, banner_url, status, tickets_sold, created_at, updated_at`,
    [status, eventId]
  );

  return result.rows[0];
};

module.exports = { createEvent, getOrganizerEvents, getAllEvents, getEventById, updateEvent, deleteEvent, countActiveEvents, updateEventStatus };
