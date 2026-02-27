import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class User extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public emailVerified!: boolean;
  public image!: string | null;
  public role!: string; 
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user", 
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
  }
);

export default User;