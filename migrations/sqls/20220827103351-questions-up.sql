/* Replace with your SQL commands */

CREATE TABLE questions(
    id SERIAL PRIMARY KEY,
    author INTEGER NOT NULL,
    optionOne TEXT NOT NULL,
    optionTwo TEXT NOT NULL,
    
    FOREIGN KEY (author) REFERENCES users(id) ON UPDATE CASCADE
);

