import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.ts";

const connectionUri = process.env.DATABASE_URL || "mysql://root:@localhost:3306/vibecoding_pzn";

// Membuat connection pool ke MySQL
const poolConnection = mysql.createPool({
  uri: connectionUri,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Menginisialisasi Drizzle ORM instance
export const db = drizzle(poolConnection, { schema, mode: "default" });
