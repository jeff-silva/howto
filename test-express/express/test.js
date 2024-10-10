import test from "node:test";
import assert from "node:assert";

// import AppModule from "./src/App/AppModule.js";
// import AutoModule from "./src/Auto/AutoModule.js";

// import { App } from "./src/App.js";
// const app = new App([AppModule, AutoModule]);
// app.init();

// test("synchronous passing test", (t) => {
//   // This test passes because it does not throw an exception.
//   assert.strictEqual(1, 1);
// });

test.describe("A thing", () => {
  test.it("should work", () => {
    assert.strictEqual(1, 1);
  });

  test.it("should be ok", () => {
    assert.strictEqual(2, 2);
  });

  test.describe("a nested thing", () => {
    test.it("should work", () => {
      assert.strictEqual(3, 3);
    });
  });
});
