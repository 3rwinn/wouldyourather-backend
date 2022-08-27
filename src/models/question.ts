import client from "../database";

export type Question = {
  id?: number;
  author: number;
  optionOne: string;
  optionTwo: string;
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

  async show(id: number): Promise<Question> {
    try {
      const sql = "SELECT * FROM questions where id=($1)";
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`unable to show question ${id}: ${err}`);
    }
  }

  async create(q: Question): Promise<Question> {
    try {
      const sql =
        "INSERT INTO questions (author, optionOne, optionTwo) VALUES($1, $2, $3) RETURNING *";
      const conn = await client.connect();

      const result = await conn.query(sql, [
        q.author,
        q.optionOne,
        q.optionTwo,
      ]);
      const question = result.rows[0];

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
}
