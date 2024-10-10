import { Model, sequelize, SequelizeDataTypes } from "../../App.js";

class AppUser extends Model {
  //
}

AppUser.init(
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
    email: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: SequelizeDataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "app_user",
    timestamps: true,
  }
);

export default AppUser;
