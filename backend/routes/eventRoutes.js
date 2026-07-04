const express = require('express');
const { create } = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authenticate, authorize('organizer'), create);

module.exports = router;
