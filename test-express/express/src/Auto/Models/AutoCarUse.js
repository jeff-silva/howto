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
  },
  {
    sequelize,
    tableName: "auto_car_use",
    timestamps: true,
  }
);
