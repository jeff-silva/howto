import { Test } from "../../App.js";

export class AppUserTest extends Test {
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

  async testAppUserCreate() {
    let user = (
      await (await fetch("https://randomuser.me/api/?results=1")).json()
    ).results.at(0);

    const resp = await (
      await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          password: user.email,
        }),
      })
    ).json();

    console.log(resp);
  }

  async testAppUserUpdate() {}

  async testAppUserDelete() {}

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
