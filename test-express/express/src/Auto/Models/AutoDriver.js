import { Model, sequelize, SequelizeDataTypes } from "../../App.js";

class AutoDriver extends Model {
  async onSeed() {
    await AutoDriver.findOrCreate({
      where: { id: 1 },
      defaults: { name: "Maria" },
    });
    await AutoDriver.findOrCreate({
      where: { id: 2 },
      defaults: { name: "João" },
    });
  }
}

AutoDriver.init(
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
    modelName: "auto_driver",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default AutoDriver;
