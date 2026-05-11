import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const table = "routines";
  const column = "skinTypeTags";
  const tableDesc = await queryInterface.describeTable(table);
  if (tableDesc[column]) {
    return;
  }
  await queryInterface.addColumn(table, column, {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  });
};

export const down: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const table = "routines";
  const column = "skinTypeTags";
  const tableDesc = await queryInterface.describeTable(table);
  if (!tableDesc[column]) {
    return;
  }
  await queryInterface.removeColumn(table, column);
};
