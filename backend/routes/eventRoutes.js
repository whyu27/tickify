const express = require('express');
const { create, getOrganizerEvents, getAllEvents, getEventById, updateEvent } = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', authenticate, authorize('organizer'), create);
router.get('/my-events', authenticate, authorize('organizer'), getOrganizerEvents);
router.get('/:id', getEventById);
router.put('/:id', authenticate, authorize('organizer'), updateEvent);

module.exports = router;
