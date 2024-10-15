import { Test } from "../../App.js";

export default class AutoTest extends Test {
  async testAutoCar({ test, assert }) {
    test("Criar veículo", async (t) => {
      this.autoCar = await this.request({
        method: "post",
        url: "http://localhost:3000/api/v1/auto_car",
        data: { plate: "BAR2E20", color: "#ffffff", brand: "Fiat" },
      });

      assert.strictEqual(true, this.autoCar.data.success);
    });

    test("Alterar veículo", async (t) => {
      const { entity } = this.autoCar.data;
      this.autoCar = await this.request({
        method: "put",
        url: `http://localhost:3000/api/v1/auto_car/${entity.id}`,
        data: { plate: "BAR2E21" },
      });

      assert.strictEqual(true, this.autoCar.data.success);
    });
  }

  async testAutoDrive({ test, assert }) {
    test("Criar motorista", async (t) => {
      this.autoDriver = await this.request({
        method: "post",
        url: "http://localhost:3000/api/v1/auto_driver",
        data: { name: "João" },
      });

      assert.strictEqual(true, this.autoDriver.data.success);
    });

    test("Alterar motorista", async (t) => {
      const { entity } = this.autoDriver.data;
      this.autoDriver = await this.request({
        method: "put",
        url: `http://localhost:3000/api/v1/auto_driver/${entity.id}`,
        data: { name: "João da Silva" },
      });

      assert.strictEqual(true, this.autoDriver.data.success);
    });
  }

  async testAutoCarUse({ test, assert }) {
    test("Criar uso de veículo válido", async (t) => {
      this.autoCarUse = await this.request({
        method: "post",
        url: "http://localhost:3000/api/v1/auto_car_use",
        data: {
          driver_id: this.autoDriver.data.entity.id,
          car_id: this.autoCar.data.entity.id,
          use_start: "2024-01-01 00:00:00",
          use_final: "2024-01-15 00:00:00",
        },
      });

      assert.strictEqual(true, this.autoCarUse.data.success);
    });

    test("Criar uso de veículo inválido", async (t) => {
      this.autoCarUse = await this.request({
        method: "post",
        url: "http://localhost:3000/api/v1/auto_car_use",
        data: {
          driver_id: this.autoDriver.data.entity.id,
          car_id: this.autoCar.data.entity.id,
          use_start: "2024-01-03 00:00:00",
          use_final: "2024-01-10 00:00:00",
        },
      });

      assert.strictEqual(true, this.autoCarUse.status == 500);
    });
  }

  // async testAutoCarCrud({ test, assert }) {
  //   return await this.requestTests("Car", test, assert, {
  //     create: (scope) => {
  //       return {
  //         method: "post",
  //         url: "http://localhost:3000/api/v1/auto_car",
  //         data: {
  //           plate: "AAA0A00",
  //           color: "#ff0000",
  //           brand: "Volkswagen",
  //         },
  //       };
  //     },
  //     update: async (scope) => {
  //       if (!scope.create) return null;
  //       const created = scope.create.data.entity;
  //       return {
  //         method: "put",
  //         url: `http://localhost:3000/api/v1/auto_car/${created.id}`,
  //         data: { name: `${created.name} (Updated)` },
  //       };
  //     },
  //   });
  // }
  // async testAutoDriverCrud({ test, assert }) {
  //   return await this.requestTests("Driver", test, assert, {
  //     create: (scope) => {
  //       return {
  //         method: "post",
  //         url: "http://localhost:3000/api/v1/auto_driver",
  //         data: {
  //           name: "John Doe",
  //         },
  //       };
  //     },
  //     update: async (scope) => {
  //       if (!scope.create) return null;
  //       const created = scope.create.data.entity;
  //       return {
  //         method: "put",
  //         url: `http://localhost:3000/api/v1/auto_driver/${created.id}`,
  //         data: { name: `${created.name} (Updated)` },
  //       };
  //     },
  //     // delete: async (scope) => {
  //     //   const updated = scope.update.data.entity;
  //     //   return {
  //     //     method: "delete",
  //     //     url: `http://localhost:3000/api/v1/auto_driver/${updated.id}`,
  //     //   };
  //     // },
  //   });
  // }
  // async testAutoCarUse() {
  //   // return await this.requestTests();
  // }
}
