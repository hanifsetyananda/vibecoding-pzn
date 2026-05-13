import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { users, sessions } from "../db/schema.ts";

interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserPayload {
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

/**
 * Logika bisnis untuk mengotentikasi pengguna dan membuat sesi baru.
 * Mengembalikan token UUID unik jika email dan password valid.
 */
export async function loginUser(payload: LoginUserPayload): Promise<string> {
  // 1. Cari pengguna berdasarkan email
  const foundUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  if (foundUsers.length === 0) {
    throw new Error("email atau password salah");
  }

  const user = foundUsers[0];

  // 2. Verifikasi kecocokan password menggunakan bcrypt
  const isPasswordMatch = bcrypt.compareSync(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new Error("email atau password salah");
  }

  // 3. Buat token sesi baru berwujud UUID
  const sessionToken = crypto.randomUUID();

  // 4. Simpan sesi ke database
  await db.insert(sessions).values({
    token: sessionToken,
    userId: user.id,
  });

  return sessionToken;
}
