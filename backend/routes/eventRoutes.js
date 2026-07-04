const express = require('express');
const { create, getOrganizerEvents, getAllEvents, getEventById } = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', authenticate, authorize('organizer'), create);
router.get('/my-events', authenticate, authorize('organizer'), getOrganizerEvents);
router.get('/:id', getEventById);

module.exports = router;
