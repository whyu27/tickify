-- Tickify Database Migration
-- Add mint_status, minted_at, user_id, wallet_address, token_id columns to tickets table
-- Make ticket_id_onchain nullable

-- 1. Drop the NOT NULL constraint on ticket_id_onchain
ALTER TABLE tickets ALTER COLUMN ticket_id_onchain DROP NOT NULL;

-- 2. Add user_id column referencing users(id) if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tickets' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE tickets ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
        -- Backfill existing participant_id to user_id
        UPDATE tickets SET user_id = participant_id WHERE user_id IS NULL;
    END IF;
END $$;

-- 3. Add wallet_address column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tickets' AND column_name = 'wallet_address'
    ) THEN
        ALTER TABLE tickets ADD COLUMN wallet_address VARCHAR(255);
        -- Backfill existing owner_wallet to wallet_address
        UPDATE tickets SET wallet_address = owner_wallet WHERE wallet_address IS NULL;
    END IF;
END $$;

-- 4. Add token_id column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tickets' AND column_name = 'token_id'
    ) THEN
        ALTER TABLE tickets ADD COLUMN token_id BIGINT UNIQUE;
        -- Backfill existing ticket_id_onchain to token_id
        UPDATE tickets SET token_id = ticket_id_onchain WHERE token_id IS NULL;
    END IF;
END $$;

-- 5. Add mint_status column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tickets' AND column_name = 'mint_status'
    ) THEN
        ALTER TABLE tickets ADD COLUMN mint_status VARCHAR(20) DEFAULT 'PENDING';
        -- Add constraint
        ALTER TABLE tickets ADD CONSTRAINT chk_mint_status CHECK (mint_status IN ('PENDING', 'SUCCESS', 'FAILED'));
        -- Backfill existing records to SUCCESS since they are legacy and assume they were successful
        UPDATE tickets SET mint_status = 'SUCCESS' WHERE mint_status = 'PENDING';
    END IF;
END $$;

-- 6. Add minted_at column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tickets' AND column_name = 'minted_at'
    ) THEN
        ALTER TABLE tickets ADD COLUMN minted_at TIMESTAMP;
        -- Backfill existing records
        UPDATE tickets SET minted_at = created_at WHERE minted_at IS NULL;
    END IF;
END $$;
