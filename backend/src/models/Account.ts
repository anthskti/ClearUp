import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class Account extends Model {
  declare id: string;
  declare accountId: string;
  declare providerId: string;
  declare userId: string;
  declare accessToken: string | null;
  declare refreshToken: string | null;
  declare idToken: string | null;
  declare accessTokenExpiresAt: Date | null;
  declare refreshTokenExpiresAt: Date | null;
  declare scope: string | null;
  declare password: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Account.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    idToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    accessTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refreshTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Credentials provider
    },
  },
  {
    sequelize,
    modelName: "Account",
    tableName: "account",
  }
);

export default Account;