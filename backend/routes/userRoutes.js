const express = require('express');
const { updateWallet, disconnectWallet } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/connect-wallet', authenticate, updateWallet);
router.post('/disconnect-wallet', authenticate, disconnectWallet);

module.exports = router;
