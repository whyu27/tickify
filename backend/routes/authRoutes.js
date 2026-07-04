const express = require('express');
const { register, login, getProfile, organizerOnly, participantOnly } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/organizer-only', authenticate, authorize('organizer'), organizerOnly);
router.get('/participant-only', authenticate, authorize('participant'), participantOnly);

module.exports = router;
