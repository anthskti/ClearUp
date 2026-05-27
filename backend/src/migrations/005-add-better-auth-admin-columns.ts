import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

const userTable = "user";
const sessionTable = "session";

export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const userDesc = await queryInterface.describeTable(userTable);

  if (!userDesc.banned) {
    await queryInterface.addColumn(userTable, "banned", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }
  if (!userDesc.banReason) {
    await queryInterface.addColumn(userTable, "banReason", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }
  if (!userDesc.banExpires) {
    await queryInterface.addColumn(userTable, "banExpires", {
      type: DataTypes.DATE,
      allowNull: true,
    });
  }

  const sessionDesc = await queryInterface.describeTable(sessionTable);
  if (!sessionDesc.impersonatedBy) {
    await queryInterface.addColumn(sessionTable, "impersonatedBy", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }
};

export const down: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  const userDesc = await queryInterface.describeTable(userTable);
  if (userDesc.banExpires) {
    await queryInterface.removeColumn(userTable, "banExpires");
  }
  if (userDesc.banReason) {
    await queryInterface.removeColumn(userTable, "banReason");
  }
  if (userDesc.banned) {
    await queryInterface.removeColumn(userTable, "banned");
  }

  const sessionDesc = await queryInterface.describeTable(sessionTable);
  if (sessionDesc.impersonatedBy) {
    await queryInterface.removeColumn(sessionTable, "impersonatedBy");
  }
};
