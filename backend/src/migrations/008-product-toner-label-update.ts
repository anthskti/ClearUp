// Updating the toner labels to the new format [benefit, format]
import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

// PostgreSQL arrays are 1-indexed: labels[1] = benefit, labels[2] = format.
// Updates all existing toner products to be bottled toners
export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { sequelize } = context;
  await sequelize.query(`
    UPDATE products
    SET labels = ARRAY[labels[1], 'Bottled']
    WHERE category = 'toner'
      AND cardinality(labels) = 1;
  `);
};

export const down: MigrationFn<Ctx> = async ({ context }) => {
  const { sequelize } = context;
  await sequelize.query(`
    UPDATE products
    SET labels = ARRAY[labels[1]]
    WHERE category = 'toner'
      AND cardinality(labels) = 2
      AND labels[2] = 'Bottled';
  `);
};