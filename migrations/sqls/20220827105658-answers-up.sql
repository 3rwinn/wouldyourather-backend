/* Replace with your SQL commands */
CREATE TABLE answers(
    id SERIAL PRIMARY KEY,
    question INTEGER NOT NULL,
    optionOne TEXT NULL,
    optionTwo TEXT NULL,

    FOREIGN KEY (question) REFERENCES questions(id) ON UPDATE CASCADE
);