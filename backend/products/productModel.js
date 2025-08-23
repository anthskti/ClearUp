// Model / DAO for products

const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL });

class ProductDAO {
  async findAll() {
    const result = await pool.query("SELECT * FROM products");
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id] // prevents SQL injection
    );
    return result.rows[0];
  }

  async insert(product) {
    const { name, brand, type, benefits, country, images } = product;
    const result = await pool.query(
      `INSERT INTO products (name, brand, type, benefits, country, images) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, brand, type, benefits, country, images]
    );
    return result.rows[0];
  }
}

module.exports = new ProductDAO();
