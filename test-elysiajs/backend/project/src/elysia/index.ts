import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";

const appUser = new Elysia({ prefix: "/api/v1/app_user" })
  .post("/", () => ({}), {
    detail: { tags: ["app_user"] },
  })
  .put("/:id", ({ params: { id } }) => ({ id }), {
    detail: { tags: ["app_user"] },
  })
  .get("/", () => [], {
    detail: { tags: ["app_user"] },
  })
  .get("/:id", ({ params: { id } }) => ({ id }), {
    detail: { tags: ["app_user"] },
  })
  .delete("/:id", ({ params: { id } }) => ({ id }), {
    detail: { tags: ["app_user"] },
  });

const app = new Elysia()
  .use(openapi())
  .get("/", () => ({ hello: "world" }))
  .use(appUser)
  .listen(3000);
