import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class Session extends Model {
  public id!: string;
  public expiresAt!: Date;
  public token!: string;
  public ipAddress!: string | null;
  public userAgent!: string | null;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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