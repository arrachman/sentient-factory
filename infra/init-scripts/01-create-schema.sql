-- Force database/session timezone to GMT+7 (Asia/Bangkok)
ALTER DATABASE sentient_factory SET timezone TO 'Asia/Bangkok';
ALTER ROLE CURRENT_USER SET timezone TO 'Asia/Bangkok';
SET TIME ZONE 'Asia/Bangkok';

-- Create additional user if needed
CREATE USER IF NOT EXISTS app_user WITH PASSWORD 'UserPassword123!';
GRANT ALL PRIVILEGES ON DATABASE sentient_factory TO app_user;

ALTER ROLE app_user SET timezone TO 'Asia/Bangkok';

-- Create sample table
\c sentient_factory;
CREATE TABLE IF NOT EXISTS m0_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO m0_users (username, email) VALUES 
    ('admin', 'admin@sentient-factory.com'),
    ('user1', 'user1@sentient-factory.com')
ON CONFLICT (username) DO NOTHING;
