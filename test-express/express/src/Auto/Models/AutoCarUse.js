import { Model, sequelize, SequelizeDataTypes } from "../../App.js";

export default class AutoCarUse extends Model {
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
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
    use_final: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
    driver_id: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
    car_id: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
    observation: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "auto_car_use",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
