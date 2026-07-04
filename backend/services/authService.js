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
    'SELECT id, name, email, password, role, created_at FROM users WHERE email = $1',
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
    'SELECT id, name, email, role, wallet_address, created_at FROM users WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
};

module.exports = { registerUser, loginUser, getUserById };
