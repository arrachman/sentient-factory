-- Create additional user if needed
CREATE USER IF NOT EXISTS app_user WITH PASSWORD 'UserPassword123!';
GRANT ALL PRIVILEGES ON DATABASE sentient_factory TO app_user;

-- Create sample table
\c sentient_factory;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, email) VALUES 
    ('admin', 'admin@sentient-factory.com'),
    ('user1', 'user1@sentient-factory.com')
ON CONFLICT (username) DO NOTHING;
