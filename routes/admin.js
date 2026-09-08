const express = require('express');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

/* ---------- Productos ---------- */

// GET /api/admin/productos
router.get('/productos', async (req, res) => {
  try {
    const [filas] = await pool.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM retailqa_productos p
       LEFT JOIN retailqa_categorias c ON c.id = p.categoria_id
       ORDER BY p.id DESC`
    );
    res.json({ productos: filas });
  } catch (err) {
    console.error('Error admin al listar productos:', err);
    res.status(500).json({ error: 'Error interno al obtener productos.' });
  }
});

// POST /api/admin/productos
router.post('/productos', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;
    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Nombre, precio y stock son obligatorios.' });
    }
    const [resultado] = await pool.query(
      `INSERT INTO retailqa_productos (nombre, descripcion, precio, stock, categoria_id, imagen_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion || null, precio, stock, categoria_id || null, imagen_url || null]
    );
    res.status(201).json({ id: resultado.insertId });
  } catch (err) {
    console.error('Error admin al crear producto:', err);
    res.status(500).json({ error: 'Error interno al crear producto.' });
  }
});

// PUT /api/admin/productos/:id
router.put('/productos/:id', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria_id, imagen_url, activo } = req.body;
    const [resultado] = await pool.query(
      `UPDATE retailqa_productos
       SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ?, imagen_url = ?, activo = ?
       WHERE id = ?`,
      [nombre, descripcion || null, precio, stock, categoria_id || null, imagen_url || null,
       activo === undefined ? 1 : activo, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Error admin al actualizar producto:', err);
    res.status(500).json({ error: 'Error interno al actualizar producto.' });
  }
});

// DELETE /api/admin/productos/:id  (baja lógica)
router.delete('/productos/:id', async (req, res) => {
  try {
    const [resultado] = await pool.query(
      'UPDATE retailqa_productos SET activo = 0 WHERE id = ?',
      [req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Error admin al eliminar producto:', err);
    res.status(500).json({ error: 'Error interno al eliminar producto.' });
  }
});

/* ---------- Usuarios y roles ---------- */

// GET /api/admin/usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT id, nombre, correo, rol, created_at FROM retailqa_usuarios ORDER BY created_at DESC'
    );
    res.json({ usuarios: filas });
  } catch (err) {
    console.error('Error admin al listar usuarios:', err);
    res.status(500).json({ error: 'Error interno al obtener usuarios.' });
  }
});

// PUT /api/admin/usuarios/:id/rol { rol }
router.put('/usuarios/:id/rol', async (req, res) => {
  try {
    const { rol } = req.body;
    if (!['cliente', 'admin'].includes(rol)) {
      return res.status(400).json({ error: "El rol debe ser 'cliente' o 'admin'." });
    }
    const [resultado] = await pool.query(
      'UPDATE retailqa_usuarios SET rol = ? WHERE id = ?',
      [rol, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Error admin al actualizar rol:', err);
    res.status(500).json({ error: 'Error interno al actualizar rol.' });
  }
});

/* ---------- Pedidos ---------- */

// GET /api/admin/pedidos
router.get('/pedidos', async (req, res) => {
  try {
    const [filas] = await pool.query(
      `SELECT pe.id, pe.total, pe.estado, pe.direccion_envio, pe.created_at,
              u.nombre AS cliente_nombre, u.correo AS cliente_correo
       FROM retailqa_pedidos pe
       JOIN retailqa_usuarios u ON u.id = pe.usuario_id
       ORDER BY pe.created_at DESC`
    );
    res.json({ pedidos: filas });
  } catch (err) {
    console.error('Error admin al listar pedidos:', err);
    res.status(500).json({ error: 'Error interno al obtener pedidos.' });
  }
});

// PUT /api/admin/pedidos/:id/estado { estado }
router.put('/pedidos/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['pendiente', 'pagado', 'enviado', 'cancelado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido.' });
    }
    const [resultado] = await pool.query(
      'UPDATE retailqa_pedidos SET estado = ? WHERE id = ?',
      [estado, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Error admin al actualizar estado de pedido:', err);
    res.status(500).json({ error: 'Error interno al actualizar el pedido.' });
  }
});

module.exports = router;
