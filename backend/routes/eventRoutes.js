const express = require('express');
const { create, getOrganizerEvents, getAllEvents, getEventById, updateEvent, deleteEvent, updateStatus } = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { checkFreePlanLimit } = require('../middleware/subscriptionMiddleware');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', authenticate, authorize('organizer'), checkFreePlanLimit, upload.single('banner'), create);
router.get('/my-events', authenticate, authorize('organizer'), getOrganizerEvents);
router.get('/organizer', authenticate, authorize('organizer'), getOrganizerEvents);
router.get('/:id', getEventById);
router.put('/:id', authenticate, authorize('organizer'), upload.single('banner'), updateEvent);
router.patch('/:id/status', authenticate, authorize('organizer'), updateStatus);
router.delete('/:id', authenticate, authorize('organizer'), deleteEvent);

module.exports = router;
