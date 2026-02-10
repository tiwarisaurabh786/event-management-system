-- =========================================================
-- Event Management System Database Schema (PostgreSQL)
-- =========================================================

-- Drop tables if already exist (safe re-run)
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- =========================================================
-- USERS TABLE
-- =========================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- EVENTS TABLE
-- =========================================================
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    venue VARCHAR(255) NOT NULL,
    speaker VARCHAR(255),
    category VARCHAR(100),
    max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
    event_date_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- REGISTRATIONS TABLE
-- =========================================================
CREATE TABLE registrations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_registration
        UNIQUE (user_id, event_id)
);

-- =========================================================
-- INDEXES (Performance Optimization)
-- =========================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_registrations_event ON registrations(event_id);

-- =========================================================
-- TEST DATA
-- =========================================================

-- Users
INSERT INTO users (email, name, password, role) VALUES
('tiwarisoravvka@gmail.com', 'Saurabh', 'password', 'STUDENT'),
('admin@events.com', 'Admin', 'admin123', 'ADMIN');

-- Events
INSERT INTO events (title, description, venue, speaker, category, max_capacity, event_date_time) VALUES
(
    'Book Fair',
    'Join a large-scale book fair featuring popular authors and publishers.',
    'Delhi',
    'Ankit Awasthi',
    'Education',
    50,
    '2026-01-15 10:00:00'
),
(
    'Tech Workshop',
    'Hands-on coding workshop for beginners.',
    'Noida',
    NULL,
    'Workshop',
    30,
    '2026-01-20 14:00:00'
);
