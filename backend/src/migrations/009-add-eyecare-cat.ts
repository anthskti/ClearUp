// Updating the products category to hold eye-care products
import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { sequelize } = context;
  await sequelize.query(`
    ALTER TYPE enum_products_category ADD VALUE IF NOT EXISTS 'eyecare';
    ALTER TYPE enum_routine_products_category ADD VALUE IF NOT EXISTS 'eyecare';
  `);
};

export const down: MigrationFn<Ctx> = async () => {
  // Postgres cannot remove enum values; no-op
  return Promise.resolve();
};