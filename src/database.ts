import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  ENV,
} = process.env;

const client = new Pool({
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  database: ENV === "prod" ? POSTGRES_DB : POSTGRES_DB_TEST,
  port: parseInt(POSTGRES_PORT as string),
});

export default client;
