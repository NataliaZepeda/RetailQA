const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/productos?categoria_id=&buscar=
router.get('/', async (req, res) => {
  try {
    const { categoria_id, buscar } = req.query;
    let sql = `
      SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.imagen_url,
             c.id AS categoria_id, c.nombre AS categoria_nombre
      FROM retailqa_productos p
      LEFT JOIN retailqa_categorias c ON c.id = p.categoria_id
      WHERE p.activo = 1
    `;
    const params = [];

    if (categoria_id) {
      sql += ' AND p.categoria_id = ?';
      params.push(categoria_id);
    }
    if (buscar) {
      sql += ' AND p.nombre LIKE ?';
      params.push(`%${buscar}%`);
    }
    sql += ' ORDER BY p.nombre ASC';

    const [filas] = await pool.query(sql, params);
    res.json({ productos: filas });
  } catch (err) {
    console.error('Error al listar productos:', err);
    res.status(500).json({ error: 'Error interno al obtener productos.' });
  }
});

// GET /api/productos/categorias
router.get('/categorias/todas', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT id, nombre FROM retailqa_categorias ORDER BY nombre');
    res.json({ categorias: filas });
  } catch (err) {
    console.error('Error al listar categorías:', err);
    res.status(500).json({ error: 'Error interno al obtener categorías.' });
  }
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
  try {
    const [filas] = await pool.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM retailqa_productos p
       LEFT JOIN retailqa_categorias c ON c.id = p.categoria_id
       WHERE p.id = ? AND p.activo = 1`,
      [req.params.id]
    );
    if (filas.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json({ producto: filas[0] });
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).json({ error: 'Error interno al obtener producto.' });
  }
});

module.exports = router;
