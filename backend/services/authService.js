const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const registerUser = async (name, email, password, role) => {
  const existingUser = await pool.query(
    'SELECT email FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, hashedPassword, role]
  );

  return result.rows[0];
};

const loginUser = async (email, password) => {
  const result = await pool.query(
    'SELECT id, name, email, password, role, wallet_address, wallet_verified, created_at FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, role, wallet_address, wallet_verified, nonce, created_at FROM users WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
};

const updateWalletAddress = async (userId, walletAddress, verified = false) => {
  if (walletAddress === null) {
    const result = await pool.query(
      `UPDATE users SET wallet_address = NULL, wallet_verified = FALSE, nonce = NULL, updated_at = NOW()
       WHERE id = $1
       RETURNING wallet_address, wallet_verified`,
      [userId]
    );
    return result.rows[0];
  }

  const existingWallet = await pool.query(
    'SELECT id FROM users WHERE wallet_address = $1 AND id != $2',
    [walletAddress, userId]
  );

  if (existingWallet.rows.length > 0) {
    throw new Error('Wallet already linked to another account');
  }

  const result = await pool.query(
    `UPDATE users SET wallet_address = $1, wallet_verified = $2, nonce = NULL, updated_at = NOW()
     WHERE id = $3
     RETURNING wallet_address, wallet_verified`,
    [walletAddress, verified, userId]
  );

  return result.rows[0];
};

const generateAndStoreNonce = async (userId) => {
  const crypto = require('crypto');
  const nonce = crypto.randomUUID();
  await pool.query(
    'UPDATE users SET nonce = $1 WHERE id = $2',
    [nonce, userId]
  );
  return nonce;
};

module.exports = { registerUser, loginUser, getUserById, updateWalletAddress, generateAndStoreNonce };
