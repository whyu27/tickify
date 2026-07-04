-- Tickify Database Migration
-- Create all tables: users, events, tickets
-- Based on docs/DATABASE.md

-- ==========================================
-- Table: users
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('organizer', 'participant')),
    wallet_address  VARCHAR(255) UNIQUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- Table: events
-- ==========================================
CREATE TABLE IF NOT EXISTS events (
    id              SERIAL PRIMARY KEY,
    organizer_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    location        VARCHAR(255) NOT NULL,
    event_date      TIMESTAMP NOT NULL,
    banner_url      TEXT,
    price_eth       VARCHAR(50) NOT NULL,
    quota           INTEGER NOT NULL CHECK (quota >= 1),
    tickets_sold    INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- Table: tickets
-- ==========================================
CREATE TABLE IF NOT EXISTS tickets (
    id                  SERIAL PRIMARY KEY,
    ticket_id_onchain   BIGINT NOT NULL UNIQUE,
    event_id            INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    participant_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    owner_wallet        VARCHAR(255) NOT NULL,
    transaction_hash    VARCHAR(255) UNIQUE,
    status              VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used')),
    used_at             TIMESTAMP,
    verified_by         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- Indexes
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users (wallet_address);

CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events (organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events (status);

CREATE INDEX IF NOT EXISTS idx_tickets_participant_id ON tickets (participant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets (event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_id_onchain ON tickets (ticket_id_onchain);
CREATE INDEX IF NOT EXISTS idx_tickets_transaction_hash ON tickets (transaction_hash);
