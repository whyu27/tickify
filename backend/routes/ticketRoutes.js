const express = require('express');
const { verify, checkIn } = require('../controllers/ticketController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/verify', authenticate, authorize('organizer'), verify);
router.post('/check-in', authenticate, authorize('organizer'), checkIn);

module.exports = router;
