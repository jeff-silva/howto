import { Elysia } from "elysia";
import { AppError, AppErrorType } from "../../../../shared/errors/AppError";

import { TestSearchUseCase } from "../../application/use-cases/TestSearchUseCase";

const router = new Elysia({ prefix: "/api/v1/test" });

router.get(
  "/",
  async ({ query }) => {
    return await new TestSearchUseCase().execute(query as any);
  },
  {
    detail: { tags: ["test"] },
  },
);

export default router;
