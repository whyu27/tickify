-- Tickify Database Migration
-- Add wallet verification columns (wallet_verified and nonce) to users table

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'wallet_verified'
    ) THEN
        ALTER TABLE users
        ADD COLUMN wallet_verified BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'nonce'
    ) THEN
        ALTER TABLE users
        ADD COLUMN nonce VARCHAR(255) DEFAULT NULL;
    END IF;
END $$;
