-- Event Management Database
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'ADMIN'))
);

CREATE TABLE events (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    venue VARCHAR(255),
    max_capacity INTEGER NOT NULL,
    speaker VARCHAR(255),
    category VARCHAR(100),
    date_time TIMESTAMP
);

CREATE TABLE registrations (
    id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    event_id BIGINT REFERENCES events(id),
    UNIQUE(user_id, event_id)
);

-- Test Data
INSERT INTO users VALUES 
(1, 'tiwarisoravvka@gmail.com', 'Saurabh', 'password', 'STUDENT'),
(2, 'admin@events.com', 'Admin', 'admin123', 'ADMIN');

INSERT INTO events VALUES 
(1, 'Book Fair', 'Delhi', 50, 'Ankit Awasthi', 'Education', '2026-01-15 10:00:00', 'Join book fair!'),
(2, 'Tech Workshop', 'Noida', 30, NULL, 'Workshop', '2026-01-20 14:00:00', 'Learn coding!');
