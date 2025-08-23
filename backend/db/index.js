import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(express.json());

// connect to local docker postgres
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "skincare",
  password: "postgres",
  port: 5432,
});

// test route
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
