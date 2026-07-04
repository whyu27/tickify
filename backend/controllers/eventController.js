const { createEvent, getOrganizerEvents, getAllEvents } = require('../services/eventService');

const create = async (req, res) => {
  try {
    const { title, description, location, event_date, banner_url, price_eth, quota } = req.body;

    const errors = [];

    if (!title || title.trim() === '') {
      errors.push('Title is required');
    }

    if (!location || location.trim() === '') {
      errors.push('Location is required');
    }

    if (!event_date || isNaN(new Date(event_date).getTime())) {
      errors.push('Valid event date is required');
    }

    if (!price_eth || isNaN(Number(price_eth)) || Number(price_eth) <= 0) {
      errors.push('Price must be a positive number');
    }

    if (!quota || !Number.isInteger(Number(quota)) || Number(quota) < 1) {
      errors.push('Quota must be at least 1');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
      });
    }

    const event = await createEvent(req.user.id, {
      title: title.trim(),
      description: description || null,
      location: location.trim(),
      event_date,
      banner_url: banner_url || null,
      price_eth,
      quota: Number(quota),
    });

    return res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getOrganizerEventsHandler = async (req, res) => {
  try {
    const events = await getOrganizerEvents(req.user.id);

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getAllEventsHandler = async (req, res) => {
  try {
    const events = await getAllEvents();

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { create, getOrganizerEvents: getOrganizerEventsHandler, getAllEvents: getAllEventsHandler };
