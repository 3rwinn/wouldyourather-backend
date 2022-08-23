import client from "../database";
import bcrypt from "bcrypt";

const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

export type User = {
  id?: number;
  name: string;
  email: string;
  avatarUrl: string;
  password: string;
  questions: string;
  answers: string;
};

export type UserAuth = {
  email: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users";

      const result = await conn.query(sql);

      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get users: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = "SELECT * FROM users where id=($1)";
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`unable to show user ${id}: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const sql =
        "INSERT INTO users (name, email, avatarUrl, password) VALUES($1, $2, $3, $4) RETURNING *";
      const conn = await client.connect();

      const hashPassword = bcrypt.hashSync(
        u.password + pepper,
        parseInt(saltRounds as string)
      );

      const result = await conn.query(sql, [
        u.name,
        u.email,
        u.avatarUrl,
        hashPassword,
      ]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable to create user ${u.email}: ${err}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM users WHERE id=($1)";

      await conn.query(sql, [id]);

      conn.release();

      return true;
    } catch (err) {
      throw new Error(`unable to delete user (${id}): ${err}`);
    }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const conn = await client.connect();
    const sql = "SELECT username, password FROM users WHERE username=($1)";

    const result = await conn.query(sql, [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      if (bcrypt.compareSync(password + pepper, user.password)) {
        return user;
      }
    }

    return null;
  }
}
