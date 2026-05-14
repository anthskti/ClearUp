import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

const table = "user";
const column = "emailStatus";

export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const tableDesc = await queryInterface.describeTable(table);
  if (tableDesc[column]) {
    return;
  }
  await queryInterface.addColumn(table, column, {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
  });
};

export const down: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const tableDesc = await queryInterface.describeTable(table);
  if (!tableDesc[column]) {
    return;
  }
  await queryInterface.removeColumn(table, column);
};
