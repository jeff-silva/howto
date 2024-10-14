import { Model, sequelize, SequelizeDataTypes } from "../../App.js";

class AutoCar extends Model {
  async onSeed() {
    await AutoCar.findOrCreate({
      where: { id: 1 },
      defaults: {
        plate: "ABC0D01",
        color: "#ffffff",
        brand: "Volkswagen",
      },
    });
    await AutoCar.findOrCreate({
      where: { id: 2 },
      defaults: {
        plate: "ABC0D02",
        color: "#ffffff",
        brand: "Fiat",
      },
    });
  }
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
        const plate = this.getDataValue("plate") || "";
        return plate.toUpperCase();
      },
      validate: {
        required(value) {
          if (!value) throw new Error("Campo obrigatório");
        },
      },
    },
    color: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
      validate: {
        required(value) {
          if (!value) throw new Error("Campo obrigatório");
        },
      },
    },
    brand: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
      validate: {
        required(value) {
          if (!value) throw new Error("Campo obrigatório");
        },
      },
    },
  },
  {
    sequelize,
    tableName: "auto_car",
    modelName: "auto_car",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default AutoCar;
