import { Model, sequelize, SequelizeDataTypes } from "../../App.js";

class AutoDriver extends Model {
  async onSeed() {
    await AutoDriver.findOrCreate({
      where: { name: "Maria" },
      defaults: { name: "Maria" },
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
