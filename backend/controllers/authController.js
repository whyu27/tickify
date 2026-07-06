const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const { registerUser, loginUser, getUserById, updateWalletAddress, generateAndStoreNonce } = require('../services/authService');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const errors = [];

    if (!name || name.trim() === '') {
      errors.push('Name is required');
    }

    if (!email || email.trim() === '') {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }

    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!role || !['organizer', 'participant'].includes(role)) {
      errors.push('Role must be organizer or participant');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', '),
      });
    }

    const user = await registerUser(name, email, password, role);

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.message === 'Email already registered') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || email.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    const user = await loginUser(email, password);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const organizerOnly = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Organizer access granted',
  });
};

const participantOnly = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Participant access granted',
  });
};

const getWalletNonce = async (req, res) => {
  try {
    const nonce = await generateAndStoreNonce(req.user.id);
    return res.status(200).json({
      success: true,
      nonce,
    });
  } catch (error) {
    console.error('Error in getWalletNonce:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateWallet = async (req, res) => {
  try {
    const { walletAddress, signature, nonce } = req.body;

    if (!walletAddress || !signature || !nonce) {
      return res.status(400).json({
        success: false,
        message: 'walletAddress, signature, and nonce are required',
      });
    }

    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address format',
      });
    }

    // 1. Retrieve the stored nonce for the user
    const user = await getUserById(req.user.id);
    if (!user.nonce || user.nonce !== nonce) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired nonce',
      });
    }

    // 2. Reconstruct the message exactly as signed by the frontend
    const message = `Tickify Wallet Verification\n\nNonce:\n${nonce}`;

    // 3. Verify signature
    let recoveredAddress;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature verification',
      });
    }

    // 4. Ensure signer matches walletAddress
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Signature verification failed: signer address mismatch',
      });
    }

    // 5. Update wallet address and set wallet_verified = true
    await updateWalletAddress(req.user.id, walletAddress, true);

    // 6. Get updated profile
    const updatedUser = await getUserById(req.user.id);

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    if (error.message === 'Wallet already linked to another account') {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error in updateWallet:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const disconnectWallet = async (req, res) => {
  try {
    await updateWalletAddress(req.user.id, null);
    const user = await getUserById(req.user.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { register, login, getProfile, organizerOnly, participantOnly, updateWallet, disconnectWallet, getWalletNonce };
