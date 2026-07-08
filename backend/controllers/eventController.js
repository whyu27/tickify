const { createEvent, getOrganizerEvents, getAllEvents, getEventById, updateEvent, deleteEvent, updateEventStatus } = require('../services/eventService');

const create = async (req, res) => {
  try {
    const { title, description, location, event_date, price_eth, quota, category_id } = req.body;

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

    if (!category_id) {
      errors.push('Category is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
      });
    }

    // Get banner path from uploaded file
    const bannerUrl = req.file ? req.file.path : null;

    const event = await createEvent(req.user.id, {
      title: title.trim(),
      description: description || null,
      location: location.trim(),
      event_date,
      banner_url: bannerUrl,
      price_eth,
      quota: Number(quota),
      category_id: Number(category_id),
    });

    return res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Create event error:', error);
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

const getEventByIdHandler = async (req, res) => {
  try {
    const event = await getEventById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    return res.status(200).json({
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

const updateEventHandler = async (req, res) => {
  try {
    const { title, description, location, event_date, price_eth, quota, category_id } = req.body;

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

    if (!category_id) {
      errors.push('Category is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
      });
    }

    // Get banner path from uploaded file, or keep existing if no new file
    const bannerUrl = req.file ? req.file.path : undefined;

    const eventData = {
      title: title.trim(),
      description: description || null,
      location: location.trim(),
      event_date,
      price_eth,
      quota: Number(quota),
      category_id: Number(category_id),
    };

    // Only update banner_url if a new file was uploaded
    if (bannerUrl !== undefined) {
      eventData.banner_url = bannerUrl;
    }

    const event = await updateEvent(req.params.id, req.user.id, eventData);

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Update event error:', error);
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'Forbidden') {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const deleteEventHandler = async (req, res) => {
  try {
    await deleteEvent(req.params.id, req.user.id);

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'Forbidden') {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const event = await updateEventStatus(req.params.id, req.user.id, status);

    return res.status(200).json({
      success: true,
      data: event,
      message: `Event status updated to ${status}`,
    });
  } catch (error) {
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'Forbidden') {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'Invalid status') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { create, getOrganizerEvents: getOrganizerEventsHandler, getAllEvents: getAllEventsHandler, getEventById: getEventByIdHandler, updateEvent: updateEventHandler, deleteEvent: deleteEventHandler, updateStatus: updateStatusHandler };
