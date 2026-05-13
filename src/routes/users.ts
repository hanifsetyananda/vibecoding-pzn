import { Elysia, t } from "elysia";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";

export const userRoutes = new Elysia({ prefix: "/users" })
  // Endpoint untuk mengambil seluruh daftar pengguna dari MySQL
  .get("/", async () => {
    try {
      const allUsers = await db.select().from(users);
      return {
        success: true,
        data: allUsers,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Gagal mengambil data pengguna. Pastikan server MySQL berjalan dan tabel telah di-push.",
      };
    }
  })
  // Endpoint untuk menambahkan pengguna baru ke MySQL
  .post(
    "/",
    async ({ body }) => {
      try {
        await db.insert(users).values({
          name: body.name,
          email: body.email,
        });

        return {
          success: true,
          message: "Pengguna berhasil ditambahkan",
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || "Gagal menambahkan pengguna",
        };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
      }),
    }
  );
