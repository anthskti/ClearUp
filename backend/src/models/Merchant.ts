import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface MerchantAttributes {
  id: number;
  name: string;
  logo?: string;
  website: string;
}

interface MerchantCreationAttributes
  extends Optional<MerchantAttributes, "id"> {}

class Merchant
  extends Model<MerchantAttributes, MerchantCreationAttributes>
  implements MerchantAttributes
{
  public id!: number;
  public name!: string;
  public logo?: string;
  public website!: string;
}

Merchant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    logo: { type: DataTypes.STRING, allowNull: true },
    website: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: "merchants",
  }
);

export default Merchant;
