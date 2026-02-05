import "dotenv/config";
import { Client } from "pg";

export const db = new Client({
  connectionString: process.env.PGURI,
  ssl: false,
});

await db.connect();
