import client from "../database";

export type Question = {
  id?: number;
  author: number;
  text: string;
  optionOne: string;
  optionTwo: string;
};

export type Answer = {
  id?: number;
  question: number;
  optionOne?: string;
  optionTwo?: string;
};

export type QuestionWithAnswer = {
  id?: number;
  optionOne: string;
  optionTwo: string;
  result: Answer;
};

export class QuestionStore {
  async index(): Promise<Question[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM questions";

      const result = await conn.query(sql);

      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to get questions: ${err}`);
    }
  }

  async show(id: number): Promise<QuestionWithAnswer> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM questions where id=($1)";
      const result = await conn.query(sql, [id]);

      const retrieveAnswerSql = "SELECT * FROM answers where question=($1)";
      const retrieveAnswer = await conn.query(retrieveAnswerSql, [id]);

      conn.release();
      const data = {
        ...result.rows[0],
        result: retrieveAnswer.rows[0],
      };
      return data;
    } catch (err) {
      throw new Error(`unable to show question ${id}: ${err}`);
    }
  }

  async create(q: Question): Promise<Question> {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO questions (author, optionOne, optionTwo) VALUES($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [
        q.author,
        q.optionOne,
        q.optionTwo,
      ]);
      const question = result.rows[0];

      const answerSql = "INSERT INTO answers (question) VALUES($1) RETURNING *";
      await conn.query(answerSql, [question.id]);

      conn.release();

      return question;
    } catch (err) {
      throw new Error(`unable to create question: ${err}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM questions WHERE id=($1)";

      await conn.query(sql, [id]);

      conn.release();

      return true;
    } catch (err) {
      throw new Error(`unable to delete question (${id}): ${err}`);
    }
  }

  async addAnswer(
    question_id: string,
    optionOne?: string,
    optionTwo?: string
  ): Promise<Answer> {
    try {
      const sql =
        "UPDATE answers SET optionOne=($2), optionTwo=($3) WHERE id=($1) RETURNING *";

      const conn = await client.connect();

      const result = await conn.query(sql, [question_id, optionOne, optionTwo]);
      const answer = result.rows[0];

      return answer;
    } catch (err) {
      throw new Error(
        `unable to add answer to  question (${question_id}): ${err}`
      );
    }
  }
}
