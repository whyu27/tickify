const express = require('express');
const { verify, checkIn, getMyTickets, purchase } = require('../controllers/ticketController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/my-tickets', authenticate, authorize('participant'), getMyTickets);
router.post('/verify', authenticate, authorize('organizer'), verify);
router.post('/check-in', authenticate, authorize('organizer'), checkIn);
router.post('/purchase', authenticate, authorize('participant'), purchase);

module.exports = router;
