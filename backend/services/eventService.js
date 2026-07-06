const { pool } = require('../config/database');

const createEvent = async (organizerId, data) => {
  const { title, description, location, event_date, banner_url, price_eth, quota, category_id } = data;

  const result = await pool.query(
    `INSERT INTO events (organizer_id, title, description, location, event_date, banner_url, price_eth, quota, category_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id`,
    [organizerId, title, description, location, event_date, banner_url || null, price_eth, quota, category_id || null]
  );

  return getEventById(result.rows[0].id);
};

const getOrganizerEvents = async (organizerId) => {
  const result = await pool.query(
    `SELECT e.id, e.organizer_id, e.title, e.description, e.location, e.event_date, e.banner_url, e.price_eth, e.quota, e.tickets_sold, e.status, e.created_at, e.category_id,
            c.name AS category_name, c.slug AS category_slug
     FROM events e
     LEFT JOIN categories c ON e.category_id = c.id
     WHERE e.organizer_id = $1
     ORDER BY e.event_date ASC`,
    [organizerId]
  );

  return result.rows.map(row => ({
    ...row,
    category: row.category_id ? {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug
    } : null
  }));
};

const getAllEvents = async () => {
  const result = await pool.query(
    `SELECT e.id, e.title, e.description, e.location, e.event_date, e.price_eth, e.quota, e.tickets_sold, e.banner_url, e.status, e.category_id,
            u.name AS organizer_name,
            c.name AS category_name, c.slug AS category_slug
     FROM events e
     JOIN users u ON e.organizer_id = u.id
     LEFT JOIN categories c ON e.category_id = c.id
     WHERE e.status = 'published'
     ORDER BY e.event_date ASC`
  );

  return result.rows.map(row => ({
    ...row,
    category: row.category_id ? {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug
    } : null
  }));
};

const getEventById = async (id) => {
  const result = await pool.query(
    `SELECT e.id, e.title, e.description, e.location, e.event_date, e.price_eth, e.quota, e.tickets_sold, e.banner_url, e.status, e.created_at, e.category_id,
            u.name AS organizer_name,
            c.name AS category_name, c.slug AS category_slug
     FROM events e
     JOIN users u ON e.organizer_id = u.id
     LEFT JOIN categories c ON e.category_id = c.id
     WHERE e.id = $1`,
    [id]
  );

  const row = result.rows[0];
  if (!row) return null;

  return {
    ...row,
    category: row.category_id ? {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug
    } : null
  };
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

  const { title, description, location, event_date, banner_url, price_eth, quota, category_id } = data;

  const setClauses = [];
  const values = [];
  let paramIndex = 1;

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

  setClauses.push(`category_id = $${paramIndex++}`);
  values.push(category_id || null);

  if (data.hasOwnProperty('banner_url')) {
    setClauses.push(`banner_url = $${paramIndex++}`);
    values.push(banner_url || null);
  }

  setClauses.push(`updated_at = NOW()`);
  values.push(eventId);

  const query = `
    UPDATE events
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
  `;

  await pool.query(query, values);

  return getEventById(eventId);
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
  const validStatuses = ['draft', 'published', 'closed'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

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

  await pool.query(
    `UPDATE events
     SET status = $1, updated_at = NOW()
     WHERE id = $2`,
    [status, eventId]
  );

  return getEventById(eventId);
};

module.exports = { createEvent, getOrganizerEvents, getAllEvents, getEventById, updateEvent, deleteEvent, countActiveEvents, updateEventStatus };
