import { Model, sequelize, SequelizeDataTypes } from "../../App.js";

class AutoCar extends Model {
  //
}

AutoCar.init(
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
    plate: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
    brand: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "auto_car",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default AutoCar;
