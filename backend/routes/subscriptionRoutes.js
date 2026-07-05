const express = require('express');
const { getSubscription, upgrade } = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authenticate, getSubscription);
router.put('/upgrade', authenticate, authorize('organizer'), upgrade);

module.exports = router;
