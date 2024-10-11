import { Test } from "../../App.js";

export default class AutoTest extends Test {
  async testAutoCarCrud({ test, assert }) {
    return await this.makeCrudTests("Car", test, assert, {
      create: (scope) => {
        return {
          method: "post",
          url: "http://localhost:3000/api/v1/auto_car",
          data: {
            plate: "AAA0A00",
            color: "#ff0000",
            brand: "Volkswagen",
          },
        };
      },
      update: async (scope) => {
        const created = scope.create.data.entity;
        return {
          method: "put",
          url: `http://localhost:3000/api/v1/auto_car/${created.id}`,
          data: { name: `${created.name} (Updated)` },
        };
      },
      delete: async (scope) => {
        const updated = scope.update.data.entity;
        return {
          method: "delete",
          url: `http://localhost:3000/api/v1/auto_car/${updated.id}`,
        };
      },
    });
  }

  // async testAutoDriverCrud({ test, assert }) {
  //   return await this.makeCrudTests("Driver", test, assert, {
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
  //       const created = scope.create.data.entity;
  //       return {
  //         method: "put",
  //         url: `http://localhost:3000/api/v1/auto_driver/${created.id}`,
  //         data: { name: `${created.name} (Updated)` },
  //       };
  //     },
  //     delete: async (scope) => {
  //       const updated = scope.update.data.entity;
  //       return {
  //         method: "delete",
  //         url: `http://localhost:3000/api/v1/auto_driver/${updated.id}`,
  //       };
  //     },
  //   });
  // }
}
