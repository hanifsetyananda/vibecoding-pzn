import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";

interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

/**
 * Logika bisnis untuk mendaftarkan pengguna baru.
 * Melakukan validasi ketersediaan email dan hashing password menggunakan bcrypt.
 */
export async function registerUser(payload: RegisterUserPayload): Promise<void> {
  // 1. Periksa apakah email sudah terdaftar di database
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  if (existingUsers.length > 0) {
    throw new Error("email sudah terdaftar");
  }

  // 2. Hash password menggunakan bcrypt dengan salt rounds = 10
  const hashedPassword = bcrypt.hashSync(payload.password, 10);

  // 3. Simpan record pengguna baru ke database
  await db.insert(users).values({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  });
}
