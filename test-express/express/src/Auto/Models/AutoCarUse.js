import { Model, sequelize, SequelizeDataTypes } from "../../App.js";
import AutoDriver from "./AutoDriver.js";
import AutoCar from "./AutoCar.js";

class AutoCarUse extends Model {
  async onSeed() {
    await AutoCarUse.findOrCreate({
      where: { id: 1 },
      defaults: {
        driver_id: 1,
        car_id: 1,
        use_start: "2024-01-01 00:00:00",
        use_final: "2024-01-15 00:00:00",
      },
    });
    await AutoCarUse.findOrCreate({
      where: { id: 2 },
      defaults: {
        driver_id: 1,
        car_id: 1,
        use_start: "2024-01-01 00:00:00",
        use_final: "2024-01-15 00:00:00",
      },
    });
  }
}

AutoCarUse.init(
  {
    id: {
      type: SequelizeDataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // name: {
    //   type: SequelizeDataTypes.STRING,
    //   allowNull: true,
    // },
    driver_id: {
      type: SequelizeDataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   key: "id",
      //   model: AutoDriver,
      //   onDelete: "SET NULL",
      //   onUpdate: "SET NULL",
      // },
      validate: {
        required(value) {
          if (!value) throw new Error("Campo obrigatório");
        },
      },
    },
    car_id: {
      type: SequelizeDataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   key: "id",
      //   model: AutoCar,
      //   onDelete: "SET NULL",
      //   onUpdate: "SET NULL",
      // },
      validate: {
        required(value) {
          if (!value) throw new Error("Campo obrigatório");
        },
      },
    },
    use_start: {
      type: SequelizeDataTypes.DATE,
      allowNull: true,
      validate: {
        required(value) {
          if (!value) throw new Error("Campo obrigatório");
        },
      },
    },
    use_final: {
      type: SequelizeDataTypes.DATE,
      allowNull: true,
      validate: {
        required(value) {
          if (!value) throw new Error("Campo obrigatório");
        },
      },
    },

    observation: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "auto_car_use",
    modelName: "auto_car_use",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

AutoCarUse.hasOne(AutoDriver, {
  foreignKey: "driver_id",
  model: AutoDriver,
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});

AutoCarUse.hasOne(AutoCar, {
  foreignKey: "car_id",
  model: AutoCar,
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});

export default AutoCarUse;
