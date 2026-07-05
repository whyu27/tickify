-- Tickify Database Migration
-- Add subscription columns to users table
-- Based on docs/DATABASE.md

-- ==========================================
-- Add subscription columns to users
-- ==========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'subscription_plan'
    ) THEN
        ALTER TABLE users
        ADD COLUMN subscription_plan VARCHAR(20) DEFAULT 'free';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'subscription_status'
    ) THEN
        ALTER TABLE users
        ADD COLUMN subscription_status VARCHAR(20) DEFAULT 'active';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'subscription_end_date'
    ) THEN
        ALTER TABLE users
        ADD COLUMN subscription_end_date TIMESTAMP NULL;
    END IF;
END $$;

-- ==========================================
-- Add CHECK constraints
-- ==========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.constraint_column_usage
        WHERE table_name = 'users'
          AND constraint_name = 'ck_users_subscription_plan'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT ck_users_subscription_plan
        CHECK (subscription_plan IN ('free', 'pro'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.constraint_column_usage
        WHERE table_name = 'users'
          AND constraint_name = 'ck_users_subscription_status'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT ck_users_subscription_status
        CHECK (subscription_status IN ('active', 'expired', 'cancelled'));
    END IF;
END $$;
