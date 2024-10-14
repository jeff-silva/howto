import { Model, sequelize, SequelizeDataTypes } from "../../App.js";
import AutoDriver from "./AutoDriver.js";
import AutoCar from "./AutoCar.js";

const beforeSaveHandler = async (model, options) => {
  const driver = await AutoDriver.findByPk(model.driver_id);
  const car = await AutoCar.findByPk(model.car_id);
  const use_start = model.use_start.toString();
  const use_final = model.use_final.toString();
  model.name = `${driver.name} | ${car.name} | Entre ${use_start} e ${use_final}`;
};

class AutoCarUse extends Model {
  async onSeed() {
    await AutoCarUse.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
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
    name: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
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
    driver_id: {
      type: SequelizeDataTypes.INTEGER,
      references: { key: "id", model: AutoDriver },
      validate: {
        required(value) {
          if (!value) throw new Error("Campo obrigatório");
        },
      },
    },
    car_id: {
      type: SequelizeDataTypes.INTEGER,
      references: { key: "id", model: AutoCar },
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
    modelName: "AutoCarUse",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    // hooks: {
    //   beforeCreate: beforeSaveHandler,
    //   beforeUpdate: beforeSaveHandler,
    // },
  }
);

// AutoDriver.belongsTo(AutoCarUse);
// AutoCar.belongsTo(AutoCarUse);

// AutoDriver.hasOne(AutoCarUse, {
//   type: SequelizeDataTypes.INTEGER,
//   foreignKey: "id",
//   onDelete: "RESTRICT",
//   onUpdate: "RESTRICT",
// });

// AutoCar.hasOne(AutoCarUse, {
//   type: SequelizeDataTypes.INTEGER,
//   foreignKey: "id",
//   onDelete: "RESTRICT",
//   onUpdate: "RESTRICT",
// });

export default AutoCarUse;
