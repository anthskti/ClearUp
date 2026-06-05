// One row per (routine, product): category + optional AM/PM notes and note order.
import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

const table = "routine_products";
const uniqueIndex = "routine_products_routine_id_product_id_unique";

export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface, sequelize } = context;
  const tableDesc = await queryInterface.describeTable(table);

  if (!tableDesc.amNote) {
    await queryInterface.addColumn(table, "amNote", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }
  if (!tableDesc.pmNote) {
    await queryInterface.addColumn(table, "pmNote", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }
  if (!tableDesc.amStepOrder) {
    await queryInterface.addColumn(table, "amStepOrder", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  }
  if (!tableDesc.pmStepOrder) {
    await queryInterface.addColumn(table, "pmStepOrder", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  }

  // Drop superseded columns from the old AM/PM-row model (no data merge).
  if (tableDesc.timeOfDay || tableDesc.userNote || tableDesc.stepOrder) {
    await sequelize.query(`DELETE FROM ${table}`);
  }
  if (tableDesc.userNote) {
    await queryInterface.removeColumn(table, "userNote");
  }
  if (tableDesc.timeOfDay) {
    await queryInterface.removeColumn(table, "timeOfDay");
  }
  if (tableDesc.stepOrder) {
    await queryInterface.removeColumn(table, "stepOrder");
  }

  const indexes = (await queryInterface.showIndex(table)) as { name: string }[];
  if (!indexes.some((idx) => idx.name === uniqueIndex)) {
    await queryInterface.addIndex(table, ["routineId", "productId"], {
      unique: true,
      name: uniqueIndex,
    });
  }
};

export const down: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const tableDesc = await queryInterface.describeTable(table);

  try {
    await queryInterface.removeIndex(table, uniqueIndex);
  } catch {
    // index may not exist
  }

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

  if (tableDesc.amNote) await queryInterface.removeColumn(table, "amNote");
  if (tableDesc.pmNote) await queryInterface.removeColumn(table, "pmNote");
  if (tableDesc.amStepOrder) {
    await queryInterface.removeColumn(table, "amStepOrder");
  }
  if (tableDesc.pmStepOrder) {
    await queryInterface.removeColumn(table, "pmStepOrder");
  }
};
