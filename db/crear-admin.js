/**
 * Script para crear (o actualizar a rol admin) el primer usuario administrador.
 *
 * Uso, desde la raíz del proyecto y con las dependencias ya instaladas (npm install):
 *   node db/crear-admin.js "Nombre Admin" admin@retailqa.cl ClaveSegura123
 *
 * Requiere que el archivo .env ya esté configurado con los datos de la BD.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function main() {
  const [nombre, correo, password] = process.argv.slice(2);

  if (!nombre || !correo || !password) {
    console.error('Uso: node db/crear-admin.js "Nombre Admin" correo@ejemplo.com ClaveSegura123');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  const [existentes] = await pool.query('SELECT id FROM retailqa_usuarios WHERE correo = ?', [correo]);

  if (existentes.length > 0) {
    await pool.query(
      'UPDATE retailqa_usuarios SET rol = ?, password_hash = ?, nombre = ? WHERE correo = ?',
      ['admin', hash, nombre, correo]
    );
    console.log(`Usuario existente "${correo}" actualizado a rol admin.`);
  } else {
    await pool.query(
      'INSERT INTO retailqa_usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hash, 'admin']
    );
    console.log(`Usuario admin "${correo}" creado correctamente.`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Error al crear administrador:', err);
  process.exit(1);
});
