/* Replace with your SQL commands */
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(55) NOT NULL,
    email VARCHAR(55) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    avatarUrl TEXT NOT NULL,
    questions JSON NULL,
    answers JSON NULL
);