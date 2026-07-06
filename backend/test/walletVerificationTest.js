require('dotenv').config();
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const { ethers } = require('ethers');

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;

let testUserId;
let testUserToken;

const step = (label) => console.log(`\n=== ${label} ===`);
const pass = (msg) => console.log(`  PASS: ${msg}`);
const fail = (msg) => console.error(`  FAIL: ${msg}`);

const seedUser = async (name, email) => {
  const hashedPassword = await bcrypt.hash('test123456', 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'participant')
     RETURNING id`,
    [name, email, hashedPassword]
  );
  return result.rows[0].id;
};

const loginAndGetToken = async (email) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'test123456' }),
  });
  const data = await res.json();
  return data.data.token;
};

const getNonce = async (token) => {
  const res = await fetch(`${BASE_URL}/users/wallet/nonce`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  return { status: res.status, nonce: data.nonce };
};

const connectWallet = async (token, body) => {
  const res = await fetch(`${BASE_URL}/users/connect-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
};

const disconnectWallet = async (token) => {
  const res = await fetch(`${BASE_URL}/users/disconnect-wallet`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return { status: res.status, body: await res.json() };
};

const cleanup = async () => {
  if (testUserId) {
    await pool.query('DELETE FROM users WHERE id = $1', [testUserId]);
  }
};

(async () => {
  try {
    console.log('TICKIFY - WALLET VERIFICATION INTEGRATION TEST');
    console.log('=============================================');

    // ---- Setup ----
    step('Setup Test User');
    testUserId = await seedUser('Wallet Test User', 'wallettest@test.com');
    pass(`Test user created (id: ${testUserId})`);

    testUserToken = await loginAndGetToken('wallettest@test.com');
    pass('JWT token obtained');

    // ---- Test 1: Get Nonce ----
    step('Test 1: Request Nonce');
    const { status: nonceStatus, nonce } = await getNonce(testUserToken);
    if (nonceStatus === 200 && nonce) {
      pass(`Nonce retrieved: ${nonce}`);
    } else {
      fail(`Expected 200 and nonce, got status ${nonceStatus}`);
    }

    // ---- Test 2: Verify with correct signature ----
    step('Test 2: Connect Wallet with Correct Signature');
    const signerWallet = ethers.Wallet.createRandom();
    const walletAddress = signerWallet.address;
    const message = `Tickify Wallet Verification\n\nNonce:\n${nonce}`;
    const signature = await signerWallet.signMessage(message);

    const connectRes = await connectWallet(testUserToken, {
      walletAddress,
      signature,
      nonce,
    });

    if (connectRes.status === 200 && connectRes.body.success) {
      const user = connectRes.body.data;
      if (user.wallet_address.toLowerCase() === walletAddress.toLowerCase() && user.wallet_verified === true) {
        pass(`Wallet connected and verified: ${user.wallet_address} (verified: ${user.wallet_verified})`);
      } else {
        fail(`Database user properties mismatch. Got: address=${user.wallet_address}, verified=${user.wallet_verified}`);
      }
    } else {
      fail(`Expected 200, got status ${connectRes.status}: ${JSON.stringify(connectRes.body)}`);
    }

    // ---- Test 3: Replay Attack (Nonce re-use) ----
    step('Test 3: Replay Attack (Nonce used twice)');
    const replayRes = await connectWallet(testUserToken, {
      walletAddress,
      signature,
      nonce,
    });

    if (replayRes.status === 400) {
      pass('Backend rejected replay request with status 400 (Invalid or expired nonce)');
    } else {
      fail(`Expected 400, got status ${replayRes.status}: ${JSON.stringify(replayRes.body)}`);
    }

    // ---- Test 4: Signature with Wrong Nonce ----
    step('Test 4: Signature with Wrong Nonce');
    const { nonce: newNonce } = await getNonce(testUserToken);
    
    // sign message using the OLD nonce (which is now invalid/expired or different)
    const wrongMessage = `Tickify Wallet Verification\n\nNonce:\n${nonce}`;
    const wrongSignature = await signerWallet.signMessage(wrongMessage);

    const wrongNonceRes = await connectWallet(testUserToken, {
      walletAddress,
      signature: wrongSignature,
      nonce: newNonce,
    });

    if (wrongNonceRes.status === 400) {
      pass('Backend rejected request with wrong message/nonce with status 400');
    } else {
      fail(`Expected 400, got status ${wrongNonceRes.status}: ${JSON.stringify(wrongNonceRes.body)}`);
    }

    // ---- Test 5: Signature mismatch (wrong signer address) ----
    step('Test 5: Signature Mismatch (Wrong Signer Address)');
    const { nonce: test5Nonce } = await getNonce(testUserToken);
    const test5Message = `Tickify Wallet Verification\n\nNonce:\n${test5Nonce}`;
    const correctSig = await signerWallet.signMessage(test5Message);

    const mismatchRes = await connectWallet(testUserToken, {
      walletAddress: ethers.Wallet.createRandom().address, // different address from signerWallet
      signature: correctSig,
      nonce: test5Nonce,
    });

    if (mismatchRes.status === 400) {
      pass('Backend rejected signature mismatch with status 400');
    } else {
      fail(`Expected 400, got status ${mismatchRes.status}: ${JSON.stringify(mismatchRes.body)}`);
    }

    // ---- Test 6: Disconnect Wallet ----
    step('Test 6: Disconnect Wallet');
    const disconnectRes = await disconnectWallet(testUserToken);
    if (disconnectRes.status === 200 && disconnectRes.body.success) {
      const user = disconnectRes.body.data;
      if (user.wallet_address === null && user.wallet_verified === false) {
        pass('Wallet disconnected successfully. DB cleared (wallet_address = null, wallet_verified = false)');
      } else {
        fail(`Disconnect DB properties mismatch: address=${user.wallet_address}, verified=${user.wallet_verified}`);
      }
    } else {
      fail(`Expected 200, got status ${disconnectRes.status}: ${JSON.stringify(disconnectRes.body)}`);
    }

    step('Verification Summary');
    console.log('  All integration tests ran. Review PASS/FAIL logs above.');

  } catch (error) {
    console.error('Integration test failed with exception:', error);
  } finally {
    await cleanup();
    await pool.end();
    console.log('Cleanup complete.');
  }
})();
