const { pool } = require("../database/dbconfig");

const getDataJoin = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT pe.id_pedido, me.id_mesa, me.estado_mesa, " +
        "pro_comida.name_product AS comida_nombre, " +
        "jsonb_extract_path_text(comida.value, 'cantidad') AS cantidad_comida, " +
        "pro_bebida.name_product AS bebida_nombre, " +
        "jsonb_extract_path_text(bebida.value, 'cantidad') AS cantidad_bebida " +
        "FROM pedidos pe " +
        "JOIN mesa me ON pe.mesa_id = me.id_mesa " +
        "LEFT JOIN LATERAL jsonb_array_elements(pe.comida) AS comida ON TRUE " +
        "LEFT JOIN product pro_comida ON " +
        "jsonb_extract_path_text(comida.value, 'id') IS NOT NULL " +
        "AND jsonb_extract_path_text(comida.value, 'id') <> '' " +
        "AND (jsonb_extract_path_text(comida.value, 'id'))::int = pro_comida.id_product " +
        "LEFT JOIN LATERAL jsonb_array_elements(pe.bebida) AS bebida ON TRUE " +
        "LEFT JOIN product pro_bebida ON " +
        "jsonb_extract_path_text(bebida.value, 'id') IS NOT NULL " +
        "AND jsonb_extract_path_text(bebida.value, 'id') <> '' " +
        "AND (jsonb_extract_path_text(bebida.value, 'id'))::int = pro_bebida.id_product " +
        "WHERE me.estado_mesa = 'pedido tomado' " +
        "AND pe.fin IS NULL"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { getDataJoin };
