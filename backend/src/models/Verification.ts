import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class Verification extends Model {
  declare id: string;
  declare identifier: string;
  declare value: string;
  declare expiresAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
      type: DataTypes.TEXT,
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
    timestamps: true,
  },
);

export default Verification;
