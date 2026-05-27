import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class User extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare emailVerified: boolean;
  declare emailStatus: string;
  declare image: string | null;
  declare role: string;
  declare banned: boolean;
  declare banReason: string | null;
  declare banExpires: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
    emailStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
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
    banned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    banReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    banExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
  }
);

export default User;