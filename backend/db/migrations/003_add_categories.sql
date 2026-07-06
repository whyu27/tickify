-- Tickify Database Migration
-- Create categories table and integrate with events

-- ==========================================
-- Table: categories
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE
);

-- ==========================================
-- Insert Default Categories
-- ==========================================
INSERT INTO categories (name, slug) VALUES
('Concert', 'concert'),
('Seminar', 'seminar'),
('Workshop', 'workshop'),
('Competition', 'competition')
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- Add category_id column to events
-- ==========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'events'
          AND column_name = 'category_id'
    ) THEN
        ALTER TABLE events
        ADD COLUMN category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
END $$;
