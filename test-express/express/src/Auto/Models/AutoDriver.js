import { Model, sequelize, SequelizeDataTypes } from "../../App.js";

export default class AutoCarDriver extends Model {
  //
}

AutoCarDriver.init(
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
    tableName: "auto_driver",
    timestamps: true,
  }
);
