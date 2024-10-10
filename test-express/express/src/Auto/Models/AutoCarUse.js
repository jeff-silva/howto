import { Model, sequelize, SequelizeDataTypes } from "../../App.js";
import AutoDriver from "./AutoDriver.js";
import AutoCar from "./AutoCar.js";

class AutoCarUse extends Model {
  //
}

AutoCarUse.init(
  {
    id: {
      type: SequelizeDataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
    use_start: {
      type: SequelizeDataTypes.DATE,
      allowNull: true,
    },
    use_final: {
      type: SequelizeDataTypes.DATE,
      allowNull: true,
    },
    driver_id: {
      type: SequelizeDataTypes.INTEGER,
      references: { key: "id", model: AutoDriver },
    },
    car_id: {
      type: SequelizeDataTypes.INTEGER,
      references: { key: "id", model: AutoCar },
    },
    observation: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "auto_car_use",
    modelName: "AutoCarUse",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default AutoCarUse;
