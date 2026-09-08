const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/pedidos/checkout { direccion_envio }
router.post('/checkout', requireAuth, async (req, res) => {
  const conexion = await pool.getConnection();
  try {
    const usuarioId = req.session.usuario.id;
    const { direccion_envio } = req.body;

    await conexion.beginTransaction();

    const [items] = await conexion.query(
      `SELECT ci.id AS item_id, ci.cantidad, p.id AS producto_id, p.nombre, p.precio, p.stock
       FROM retailqa_carrito_items ci
       JOIN retailqa_productos p ON p.id = ci.producto_id
       WHERE ci.usuario_id = ?
       FOR UPDATE`,
      [usuarioId]
    );

    if (items.length === 0) {
      await conexion.rollback();
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }

    for (const item of items) {
      if (item.cantidad > item.stock) {
        await conexion.rollback();
        return res.status(409).json({
          error: `Stock insuficiente para "${item.nombre}". Disponible: ${item.stock}.`
        });
      }
    }

    const total = items.reduce((acc, it) => acc + Number(it.precio) * it.cantidad, 0);

    const [pedidoResultado] = await conexion.query(
      'INSERT INTO retailqa_pedidos (usuario_id, total, estado, direccion_envio) VALUES (?, ?, ?, ?)',
      [usuarioId, total, 'pagado', direccion_envio || null]
    );
    const pedidoId = pedidoResultado.insertId;

    for (const item of items) {
      await conexion.query(
        `INSERT INTO retailqa_pedido_items (pedido_id, producto_id, nombre_producto, precio_unitario, cantidad)
         VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, item.producto_id, item.nombre, item.precio, item.cantidad]
      );
      await conexion.query(
        'UPDATE retailqa_productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    await conexion.query('DELETE FROM retailqa_carrito_items WHERE usuario_id = ?', [usuarioId]);

    await conexion.commit();
    res.status(201).json({ pedido_id: pedidoId, total });
  } catch (err) {
    await conexion.rollback();
    console.error('Error en checkout:', err);
    res.status(500).json({ error: 'Error interno al procesar el pedido.' });
  } finally {
    conexion.release();
  }
});

// GET /api/pedidos - historial del usuario autenticado
router.get('/', requireAuth, async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const [pedidos] = await pool.query(
      'SELECT id, total, estado, direccion_envio, created_at FROM retailqa_pedidos WHERE usuario_id = ? ORDER BY created_at DESC',
      [usuarioId]
    );
    res.json({ pedidos });
  } catch (err) {
    console.error('Error al obtener historial de pedidos:', err);
    res.status(500).json({ error: 'Error interno al obtener el historial.' });
  }
});

// GET /api/pedidos/:id - detalle de un pedido propio
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const [pedidos] = await pool.query(
      'SELECT * FROM retailqa_pedidos WHERE id = ? AND usuario_id = ?',
      [req.params.id, usuarioId]
    );
    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    const [items] = await pool.query(
      'SELECT * FROM retailqa_pedido_items WHERE pedido_id = ?',
      [req.params.id]
    );
    res.json({ pedido: pedidos[0], items });
  } catch (err) {
    console.error('Error al obtener detalle de pedido:', err);
    res.status(500).json({ error: 'Error interno al obtener el pedido.' });
  }
});

module.exports = router;
