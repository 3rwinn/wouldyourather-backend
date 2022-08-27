import client from "../database";

export type Question = {
  id?: number;
  author: number;
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
      const sql = "SELECT * FROM questions ORDER BY id DESC";
      const { rows } = await conn.query(sql);

      conn.release();
      return rows;
    } catch (err) {
      throw new Error(`unable to get questions: ${err}`);
    }
  }

  async show(id: number): Promise<QuestionWithAnswer> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM questions where id=($1)";
      const result = await conn.query(sql, [id]);

     
      return result.rows[0];
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

      // first we delete the answer related to the question
      const answerDeleteSql = "DELETE FROM answers WHERE question=($1)";
      await conn.query(answerDeleteSql, [id]);

      // next we delete the question
      const sql = "DELETE FROM questions WHERE id=($1)";
      await conn.query(sql, [id]);

      conn.release();

      return true;
    } catch (err) {
      throw new Error(`unable to delete question (${id}): ${err}`);
    }
  }
}
