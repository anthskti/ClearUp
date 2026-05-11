import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class Account extends Model {
  public id!: string;
  public accountId!: string;
  public providerId!: string;
  public userId!: string;
  public accessToken!: string | null;
  public refreshToken!: string | null;
  public idToken!: string | null;
  public accessTokenExpiresAt!: Date | null;
  public refreshTokenExpiresAt!: Date | null;
  public scope!: string | null;
  public password!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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