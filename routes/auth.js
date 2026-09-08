const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { esPasswordValida } = require('../lib/negocio');

const router = express.Router();

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
    }
    if (!esPasswordValida(password)) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const [existentes] = await pool.query(
      'SELECT id FROM retailqa_usuarios WHERE correo = ?',
      [correo]
    );
    if (existentes.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [resultado] = await pool.query(
      'INSERT INTO retailqa_usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hash, 'cliente']
    );

    req.session.usuario = { id: resultado.insertId, nombre, correo, rol: 'cliente' };
    res.status(201).json({ usuario: req.session.usuario });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error interno al registrar usuario.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    }

    const [filas] = await pool.query(
      'SELECT * FROM retailqa_usuarios WHERE correo = ?',
      [correo]
    );
    if (filas.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const usuario = filas[0];
    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    };
    res.json({ usuario: req.session.usuario });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno al iniciar sesión.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({ usuario: req.session.usuario || null });
});

module.exports = router;
