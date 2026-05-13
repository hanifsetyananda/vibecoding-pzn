import { Elysia, t } from "elysia";
import { registerUser } from "../services/users-service.ts";

/**
 * Presentasi layer / routing untuk entitas users.
 * Menangani pendaftaran pengguna baru pada endpoint POST /api/users.
 */
export const usersRoute = new Elysia({ prefix: "/api/users" }).post(
  "/",
  async ({ body, set }) => {
    try {
      await registerUser({
        name: body.name,
        email: body.email,
        password: body.password,
      });

      set.status = 201; // Created
      return {
        data: "ok",
      };
    } catch (error: any) {
      set.status = 400; // Bad Request
      return {
        data: error.message || "Gagal melakukan registrasi",
      };
    }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 1 }),
    }),
  }
);
