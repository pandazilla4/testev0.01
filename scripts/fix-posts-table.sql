-- Drop the existing foreign key constraint
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_admin_id_fkey;

-- Add a more flexible admin_id column that can reference either users or admins table
-- We'll handle the validation in the application layer instead of database constraints
ALTER TABLE posts ALTER COLUMN admin_id TYPE UUID;

-- Add an admin_username column to store the admin name directly
ALTER TABLE posts ADD COLUMN IF NOT EXISTS admin_username VARCHAR(255);

-- Update existing posts to include admin username if any exist
UPDATE posts 
SET admin_username = (
  SELECT username 
  FROM users 
  WHERE users.id = posts.admin_id AND users.is_admin = true
  LIMIT 1
)
WHERE admin_username IS NULL;

-- If no match in users table, try admins table
UPDATE posts 
SET admin_username = (
  SELECT username 
  FROM admins 
  WHERE admins.id = posts.admin_id
  LIMIT 1
)
WHERE admin_username IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_posts_admin_username ON posts(admin_username);
