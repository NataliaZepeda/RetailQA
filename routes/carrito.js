const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/carrito - ver carrito del usuario autenticado
router.get('/', requireAuth, async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const [items] = await pool.query(
      `SELECT ci.id AS item_id, ci.cantidad, p.id AS producto_id, p.nombre, p.precio, p.stock, p.imagen_url
       FROM retailqa_carrito_items ci
       JOIN retailqa_productos p ON p.id = ci.producto_id
       WHERE ci.usuario_id = ?
       ORDER BY ci.created_at ASC`,
      [usuarioId]
    );
    const total = items.reduce((acc, it) => acc + Number(it.precio) * it.cantidad, 0);
    res.json({ items, total });
  } catch (err) {
    console.error('Error al obtener carrito:', err);
    res.status(500).json({ error: 'Error interno al obtener el carrito.' });
  }
});

// POST /api/carrito/agregar { producto_id, cantidad }
router.post('/agregar', requireAuth, async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const { producto_id, cantidad } = req.body;
    const cant = parseInt(cantidad, 10);

    if (!producto_id || !Number.isInteger(cant) || cant < 1) {
      return res.status(400).json({ error: 'Producto y cantidad (entero positivo) son obligatorios.' });
    }

    const [productos] = await pool.query(
      'SELECT id, stock FROM retailqa_productos WHERE id = ? AND activo = 1',
      [producto_id]
    );
    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    if (cant > productos[0].stock) {
      return res.status(409).json({ error: `Stock insuficiente. Disponible: ${productos[0].stock}.` });
    }

    await pool.query(
      `INSERT INTO retailqa_carrito_items (usuario_id, producto_id, cantidad)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)`,
      [usuarioId, producto_id, cant]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Error al agregar al carrito:', err);
    res.status(500).json({ error: 'Error interno al agregar al carrito.' });
  }
});

// PUT /api/carrito/:itemId { cantidad }
router.put('/:itemId', requireAuth, async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const cant = parseInt(req.body.cantidad, 10);

    if (!Number.isInteger(cant) || cant < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser un entero positivo.' });
    }

    const [resultado] = await pool.query(
      'UPDATE retailqa_carrito_items SET cantidad = ? WHERE id = ? AND usuario_id = ?',
      [cant, req.params.itemId, usuarioId]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Ítem de carrito no encontrado.' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al actualizar carrito:', err);
    res.status(500).json({ error: 'Error interno al actualizar el carrito.' });
  }
});

// DELETE /api/carrito/:itemId
router.delete('/:itemId', requireAuth, async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const [resultado] = await pool.query(
      'DELETE FROM retailqa_carrito_items WHERE id = ? AND usuario_id = ?',
      [req.params.itemId, usuarioId]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Ítem de carrito no encontrado.' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al eliminar ítem del carrito:', err);
    res.status(500).json({ error: 'Error interno al eliminar del carrito.' });
  }
});

module.exports = router;
