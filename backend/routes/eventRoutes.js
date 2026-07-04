const express = require('express');
const { create, getOrganizerEvents, getAllEvents } = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', authenticate, authorize('organizer'), create);
router.get('/my-events', authenticate, authorize('organizer'), getOrganizerEvents);

module.exports = router;
