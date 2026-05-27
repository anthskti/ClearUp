import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class Session extends Model {
  declare id: string;
  declare expiresAt: Date;
  declare token: string;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare userId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Session",
    tableName: "session",
  }
);

export default Session;