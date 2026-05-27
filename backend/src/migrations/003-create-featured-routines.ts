import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

const table = "featured_routines";

export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const tables = await queryInterface.showAllTables();
  const exists = tables.some(
    (t) => String(t).toLowerCase() === table.toLowerCase(),
  );
  if (exists) {
    return;
  }

  await queryInterface.createTable(table, {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    routineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "routines", key: "id" },
      onDelete: "CASCADE",
    },
    pinnedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};

export const down: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const tables = await queryInterface.showAllTables();
  const exists = tables.some(
    (t) => String(t).toLowerCase() === table.toLowerCase(),
  );
  if (!exists) {
    return;
  }
  await queryInterface.dropTable(table);
};
