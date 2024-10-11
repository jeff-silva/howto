import { Test } from "../../App.js";

export class AppUserTest extends Test {
  async testAppUserCrud({ test, assert }) {
    const crud = await this.crud({
      create: async (scope) => {
        let user = await this.request({
          url: "https://randomuser.me/api/?results=1",
        });

        user = user.data.results.at(0);

        return {
          method: "post",
          url: "http://localhost:3000/api/v1/user",
          data: {
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            password: user.email,
          },
        };
      },
      update: async (scope) => {
        return {
          method: "put",
          url: `http://localhost:3000/api/v1/user/${scope.create.data.entity.id}`,
          data: { name: `${scope.create.data.entity.name} (Updated)` },
        };
      },
      delete: async (scope) => {
        return {
          method: "delete",
          url: `http://localhost:3000/api/v1/user/${scope.update.data.entity.id}`,
        };
      },
    });

    // test("App User Create", async (t) => {
    //   assert.strictEqual(true, crud.create);
    // });

    // test("App User Update", async (t) => {
    //   assert.strictEqual(true, crud.update);
    // });

    // test("App User Delete", async (t) => {
    //   assert.strictEqual(true, crud.delete);
    // });

    console.log(crud);
  }

  // testRequest({ test, assert }) {
  //   test("Timeout 1", async (t) => {
  //     const data = await (
  //       await fetch("https://randomuser.me/api/?results=1")
  //     ).json();

  //     assert.strictEqual(
  //       true,
  //       data && data.results && Array.isArray(data.results)
  //     );
  //   });
  // }

  // async testRequestInternal({ test, assert }) {
  //   test("Request", async (t) => {
  //     const data = await (
  //       await fetch("http://localhost:3000/api/v1/test")
  //     ).json();

  //     assert.strictEqual(true, data.aaa && data.aaa == 123);
  //   });
  // }

  // async testAppUserCreate({ test, assert }) {
  //   test("User create", async (t) => {
  //     let user = await this.request({
  //       url: "https://randomuser.me/api/?results=1",
  //     });

  //     user = user.data.results.at(0);

  //     user = await this.request({
  //       method: "post",
  //       url: "http://localhost:3000/api/v1/user",
  //       data: {
  //         name: `${user.name.first} ${user.name.last}`,
  //         email: user.email,
  //         password: user.email,
  //       },
  //     });

  //     assert.strictEqual(true, !!user.data.entity.id);
  //   });
  // }

  // async testAppUserUpdate() {
  //   const users = await this.request({
  //     url: "http://localhost:3000/api/v1/user",
  //   });

  //   let user =
  //     users.data.results[Math.floor(Math.random() * users.data.results.length)];

  //   let randomUser = await this.request({
  //     url: "https://randomuser.me/api/?results=1",
  //   });

  //   randomUser = randomUser.data.results.at(0);
  //   user.name = `${randomUser.name.first} ${randomUser.name.last}`;

  //   await this.request({
  //     method: "put",
  //     url: `http://localhost:3000/api/v1/user/${user.id}`,
  //     data: user,
  //   });

  //   console.log(JSON.stringify({ users, randomUser, user }, null, 2));
  // }

  // async testAppUserDelete() {}

  // testApiV1Test({ test, assert }) {
  //   test("Timeout 1", async (t) => {
  //     console.log(
  //       await (await fetch("https://randomuser.me/api/?results=1")).json()
  //     );
  //     // assert.strictEqual(1, 1);
  //   });
  // }

  // testExample1({ test, assert }) {
  //   test("Timeout 1", (t) => {
  //     setTimeout(() => {
  //       assert.strictEqual(1, 1);
  //     }, 1000);
  //   });
  // }
  // testExample2({ test, assert }) {
  //   test("Timeout 2", (t) => {
  //     setTimeout(() => {
  //       assert.strictEqual(1, 1);
  //     }, 2000);
  //   });
  // }
  // testExample3({ test, assert }) {
  //   test.describe("A thing", () => {
  //     test.it("should work", () => {
  //       assert.strictEqual(1, 1);
  //     });
  //     test.it("should be ok", () => {
  //       assert.strictEqual(2, 2);
  //     });
  //     test.describe("a nested thing", () => {
  //       test.it("should work", () => {
  //         assert.strictEqual(3, 3);
  //       });
  //     });
  //   });
  // }
  // testExample4({ test, assert }) {
  //   test.describe("aaa", () => {
  //     test.describe("bbb", () => {
  //       test.describe("ccc", () => {
  //         //
  //       });
  //     });
  //   });
  // }
}
