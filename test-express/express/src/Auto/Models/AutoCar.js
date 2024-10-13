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
      get() {
        const brand = this.getDataValue("brand") || "";
        const plate = this.getDataValue("plate") || "";
        return `${brand} - ${plate}`;
      },
    },
    plate: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
      get() {
        return this.getDataValue("plate").toUpperCase();
      },
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
    modelName: "AutoCar",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default AutoCar;
