import { Elysia } from "elysia";
import { userRoutes } from "./routes/users.ts";

const app = new Elysia()
  // Endpoint root untuk health check
  .get("/", () => ({
    status: "OK",
    message: "Server backend berjalan dengan lancar menggunakan ElysiaJS + Drizzle ORM + MySQL",
    timestamp: new Date().toISOString(),
  }))
  // Mendaftarkan modular router
  .use(userRoutes)
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia server is running at http://${app.server?.hostname}:${app.server?.port}`
);
