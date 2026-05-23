import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

// need to update the instructions column to be a text array
export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { sequelize } = context;
  await sequelize.query(`
    ALTER TABLE products
    ALTER COLUMN instructions TYPE text[]
    USING instructions::text[];
  `);
};

export const down: MigrationFn<Ctx> = async ({ context }) => {
  const { sequelize } = context;
  await sequelize.query(`
    ALTER TABLE products
    ALTER COLUMN instructions TYPE character varying(255)[]
    USING instructions::character varying(255)[];
  `);
};
