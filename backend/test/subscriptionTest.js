const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;

let freeOrganizerToken, proOrganizerToken, participantToken;
let freeOrganizerId, proOrganizerId, participantId;

const step = (label) => console.log(`\n=== ${label} ===`);
const pass = (msg) => console.log(`  PASS: ${msg}`);
const fail = (msg) => console.error(`  FAIL: ${msg}`);

const seedUser = async (name, email, role, overrides = {}) => {
  const hashedPassword = await bcrypt.hash('test123456', 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, subscription_plan, subscription_status, subscription_end_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [name, email, hashedPassword, role, overrides.plan || 'free', overrides.status || 'active', overrides.endDate || null]
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

const createEvent = async (token, index) => {
  const res = await fetch(`${BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: `Test Event ${index}`,
      description: 'Event for testing',
      location: 'Test Location',
      event_date: new Date(Date.now() + 86400000).toISOString(),
      price_eth: '0.01',
      quota: 100,
    }),
  });
  return { status: res.status, body: await res.json() };
};

const getSubscription = async (token) => {
  const res = await fetch(`${BASE_URL}/subscription`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return { status: res.status, body: await res.json() };
};

const upgradeSubscription = async (token) => {
  const res = await fetch(`${BASE_URL}/subscription/upgrade`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return { status: res.status, body: await res.json() };
};

const cleanup = async () => {
  const ids = [freeOrganizerId, proOrganizerId, participantId].filter(Boolean);
  if (ids.length > 0) {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    await pool.query(`DELETE FROM events WHERE organizer_id IN (${placeholders})`, ids);
    await pool.query(`DELETE FROM users WHERE id IN (${placeholders})`, ids);
  }
};

(async () => {
  try {
    console.log('TICKIFY - SUBSCRIPTION MANUAL TEST');
    console.log('==================================');

    // ---- Setup ----
    step('Setup Test Users');
    freeOrganizerId = await seedUser('Free Organizer', 'freeorg@test.com', 'organizer', { plan: 'free' });
    proOrganizerId = await seedUser('Pro Organizer', 'proorg@test.com', 'organizer', { plan: 'pro', status: 'active', endDate: new Date(Date.now() + 30 * 86400000).toISOString() });
    participantId = await seedUser('Test Participant', 'participant@test.com', 'participant');
    pass(`Free organizer created (id: ${freeOrganizerId})`);
    pass(`Pro organizer created (id: ${proOrganizerId})`);
    pass(`Participant created (id: ${participantId})`);

    freeOrganizerToken = await loginAndGetToken('freeorg@test.com');
    proOrganizerToken = await loginAndGetToken('proorg@test.com');
    participantToken = await loginAndGetToken('participant@test.com');
    pass('JWT tokens obtained');

    // ---- Test 1: Organizer Free ----
    step('Test 1: Organizer Free - Event Limit');

    const free1 = await createEvent(freeOrganizerToken, 1);
    if (free1.status === 201) {
      pass('Event 1 created successfully');
    } else {
      fail(`Expected 201, got ${free1.status}: ${JSON.stringify(free1.body)}`);
    }

    const free2 = await createEvent(freeOrganizerToken, 2);
    if (free2.status === 201) {
      pass('Event 2 created successfully');
    } else {
      fail(`Expected 201, got ${free2.status}: ${JSON.stringify(free2.body)}`);
    }

    const free3 = await createEvent(freeOrganizerToken, 3);
    if (free3.status === 403 && free3.body.message === 'Free plan limit reached. Upgrade to Pro.') {
      pass('Event 3 rejected with 403 - Free plan limit reached');
    } else {
      fail(`Expected 403 + limit message, got ${free3.status}: ${JSON.stringify(free3.body)}`);
    }

    // ---- Test 2: Organizer Pro ----
    step('Test 2: Organizer Pro - Unlimited Events');

    const pro1 = await createEvent(proOrganizerToken, 1);
    if (pro1.status === 201) {
      pass('Pro event 1 created');
    } else {
      fail(`Expected 201, got ${pro1.status}: ${JSON.stringify(pro1.body)}`);
    }

    const pro2 = await createEvent(proOrganizerToken, 2);
    if (pro2.status === 201) {
      pass('Pro event 2 created');
    } else {
      fail(`Expected 201, got ${pro2.status}: ${JSON.stringify(pro2.body)}`);
    }

    const pro3 = await createEvent(proOrganizerToken, 3);
    if (pro3.status === 201) {
      pass('Pro event 3 created (no limit)');
    } else {
      fail(`Expected 201, got ${pro3.status}: ${JSON.stringify(pro3.body)}`);
    }

    // ---- Test 3: Participant ----
    step('Test 3: Participant - Cannot Access Subscription');

    const subGet = await getSubscription(participantToken);
    if (subGet.status === 200) {
      pass('Participant can GET /subscription (authenticated)');
    } else {
      fail(`Expected 200, got ${subGet.status}: ${JSON.stringify(subGet.body)}`);
    }

    const subUpgrade = await upgradeSubscription(participantToken);
    if (subUpgrade.status === 403) {
      pass('Participant PUT /subscription/upgrade rejected with 403');
    } else {
      fail(`Expected 403, got ${subUpgrade.status}: ${JSON.stringify(subUpgrade.body)}`);
    }

    // ---- Summary ----
    step('Test Summary');
    console.log('  All manual tests completed. See PASS/FAIL above.');

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await cleanup();
    console.log('\nTest data cleaned up.');
    await pool.end();
  }
})();
