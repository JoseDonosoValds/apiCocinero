const { pool } = require("../database/dbconfig");

const getCategoria = async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM categoria");
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
module.exports = { getCategoria }