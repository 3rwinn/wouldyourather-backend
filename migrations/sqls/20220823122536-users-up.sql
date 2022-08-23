/* Replace with your SQL commands */
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatarUrl TEXT NOT NULL,
    questions JSON NULL,
    answers JSON NULL
);