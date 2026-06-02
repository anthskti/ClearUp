// June 1, 2026 Migration
// Add AM/PM slot, step order, and per-product notes on routine_products junction rows.
import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

const table = "routine_products";

export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const tableDesc = await queryInterface.describeTable(table);

  if (!tableDesc.timeOfDay) {
    await queryInterface.addColumn(table, "timeOfDay", {
      type: DataTypes.ENUM("AM", "PM"),
      allowNull: false,
      defaultValue: "AM",
    });
  }

  if (!tableDesc.stepOrder) {
    await queryInterface.addColumn(table, "stepOrder", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  }

  if (!tableDesc.userNote) {
    await queryInterface.addColumn(table, "userNote", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }
};

export const down: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const tableDesc = await queryInterface.describeTable(table);

  if (tableDesc.userNote) {
    await queryInterface.removeColumn(table, "userNote");
  }
  if (tableDesc.stepOrder) {
    await queryInterface.removeColumn(table, "stepOrder");
  }
  if (tableDesc.timeOfDay) {
    await queryInterface.removeColumn(table, "timeOfDay");
  }
};
