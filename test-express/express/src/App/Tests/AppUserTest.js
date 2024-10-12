import { Test } from "../../App.js";

export class AppUserTest extends Test {
  async testAppUserCrud({ test, assert }) {
    return await this.requestTests("User", test, assert, {
      create: (scope) => {
        return {
          method: "post",
          url: "http://localhost:3000/api/v1/app_user",
          data: {
            name: `John Doe`,
            email: "johndoe@grr.la",
            password: "johndoe@grr.la",
          },
        };
      },
      update: async (scope) => {
        if (!scope.create) return null;
        const created = scope.create.data.entity;
        return {
          method: "put",
          url: `http://localhost:3000/api/v1/app_user/${created.id}`,
          data: { name: `${created.name} (Updated)` },
        };
      },
    });
  }
}
