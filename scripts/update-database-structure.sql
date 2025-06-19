-- Add admin permissions to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_main_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS codes_created_count INTEGER DEFAULT 0;

-- Add created_by_user to access_codes table
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS created_by_user UUID REFERENCES users(id);

-- Update existing admin to be the main admin
UPDATE users SET is_admin = TRUE, is_main_admin = TRUE WHERE username = 'admin';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_is_main_admin ON users(is_main_admin);
CREATE INDEX IF NOT EXISTS idx_access_codes_created_by_user ON access_codes(created_by_user);
