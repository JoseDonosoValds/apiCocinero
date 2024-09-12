
const {pool}=require('../database/dbconfig')


const postDataJoin=async(req,res)=>{
    const idPedido = req.params.idPedido;

    try {
        // Iniciar una transacción
        await pool.query('BEGIN');

        // Obtener el mesa_id correspondiente al id_pedido
        const queryMesaId = 'SELECT mesa_id FROM pedidos WHERE id_pedido = $1 AND fin IS NULL';6
        const resultMesa = await pool.query(queryMesaId, [idPedido]);

        if (resultMesa.rows.length === 0) {
            // No se encontró el pedido o ya está finalizado
            return res.status(404).json({ error: 'Pedido no encontrado o ya finalizado' });
        }

        const mesaId = resultMesa.rows[0].mesa_id;

        // Actualizar la tabla pedidos
        const queryPedidos = 'UPDATE pedidos SET fin = NOW() WHERE id_pedido = $1 AND fin IS NULL';
        const updatedRowsPedidos = await pool.query(queryPedidos, [idPedido]);

        // Actualizar la tabla mesa
        const queryMesa = 'UPDATE mesa SET estado_mesa = $1 WHERE id_mesa = $2';
        const updatedRowsMesa = await pool.query(queryMesa, ['finalizado', mesaId]);

        // Confirmar la transacción si ambas actualizaciones son exitosas
        if (updatedRowsPedidos.rowCount > 0 && updatedRowsMesa.rowCount > 0) {
            await pool.query('COMMIT');
            res.json({ message: 'Pedido finalizado correctamente' });
        } else {
            // Revertir la transacción si algo falló
            await pool.query('ROLLBACK');
            res.status(400).json({ error: 'No se pudo finalizar el pedido' });
        }
    } catch (error) {
        // Revertir la transacción si ocurrió algún error
        await pool.query('ROLLBACK');
        console.error('Error al finalizar el pedido:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {postDataJoin}