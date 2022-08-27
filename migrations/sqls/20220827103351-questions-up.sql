/* Replace with your SQL commands */

CREATE TABLE questions(
    id SERIAL PRIMARY KEY,
    author INTEGER NOT NULL,
    optionOne TEXT NOT NULL,
    optionTwo TEXT NOT NULL,
);

ALTER TABLE questions ADD CONSTRAINT "questions_author_forein" FOREIGN KEY("author") REFERENCES users("id");
