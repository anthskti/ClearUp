import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

/**
 * Better Auth OAuth state in verification.value is often >255 chars — must be TEXT.
 * Also repairs DBs where this migration was recorded but the column stayed varchar.
 * @see https://github.com/better-auth/better-auth/issues/2387
 */
export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const tableDesc = await queryInterface.describeTable("verification");
  const col = tableDesc.value;
  if (!col) return;

  const type = String(col.type ?? "").toLowerCase();
  const isText =
    type === "text" || (type.includes("text") && !type.includes("varying"));
  const isVarchar =
    type.includes("varchar") || type.includes("character varying");
  if (isText && !isVarchar) {
    return;
  }

  await queryInterface.changeColumn("verification", "value", {
    type: DataTypes.TEXT,
    allowNull: false,
  });
};

export const down: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  await queryInterface.changeColumn("verification", "value", {
    type: DataTypes.STRING(255),
    allowNull: false,
  });
};
