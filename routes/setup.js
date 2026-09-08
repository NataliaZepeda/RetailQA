const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const router = express.Router();

/**
 * POST /api/setup/crear-admin
 * Ruta de configuración inicial, pensada para hosting compartido sin acceso
 * a Terminal/SSH. Solo funciona si la variable de entorno SETUP_SECRET está
 * definida y coincide con "clave_setup" en el body. Una vez usada, elimina
 * la variable SETUP_SECRET (o bórrala) y reinicia la app para desactivarla.
 */
router.post('/crear-admin', async (req, res) => {
  try {
    const secretoConfigurado = process.env.SETUP_SECRET;
    if (!secretoConfigurado) {
      // Si no hay secreto configurado, la ruta se comporta como inexistente.
      return res.status(404).json({ error: 'No encontrado.' });
    }

    const { nombre, correo, password, clave_setup } = req.body;

    if (clave_setup !== secretoConfigurado) {
      return res.status(403).json({ error: 'Clave de configuración incorrecta.' });
    }
    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [existentes] = await pool.query('SELECT id FROM retailqa_usuarios WHERE correo = ?', [correo]);

    if (existentes.length > 0) {
      await pool.query(
        'UPDATE retailqa_usuarios SET rol = ?, password_hash = ?, nombre = ? WHERE correo = ?',
        ['admin', hash, nombre, correo]
      );
      return res.json({ ok: true, mensaje: `Usuario existente "${correo}" actualizado a rol admin.` });
    }

    await pool.query(
      'INSERT INTO retailqa_usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hash, 'admin']
    );
    res.status(201).json({ ok: true, mensaje: `Usuario admin "${correo}" creado correctamente.` });
  } catch (err) {
    console.error('Error en setup/crear-admin:', err);
    res.status(500).json({ error: 'Error interno al crear administrador.' });
  }
});

module.exports = router;
