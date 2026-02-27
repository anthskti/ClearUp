import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class Verification extends Model {
  public id!: string;
  public identifier!: string;
  public value!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Verification.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Verification",
    tableName: "verification",
  }
);

export default Verification;