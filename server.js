require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');
const pedidosRoutes = require('./routes/pedidos');
const adminRoutes = require('./routes/admin');
const setupRoutes = require('./routes/setup');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'cambia_este_secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 4, // 4 horas
      httpOnly: true
    }
  })
);

// API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/setup', setupRoutes);

// Frontend estático
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de errores no capturados
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RetailQA corriendo en el puerto ${PORT}`);
});
