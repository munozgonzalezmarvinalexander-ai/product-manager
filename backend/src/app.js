const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/product.routes');

const app = express();

// ── Middlewares ──────────────────────────
// Permite que el frontend (otro origen) consuma la API
app.use(cors());

// Permite que Express entienda JSON en el body de las peticiones
app.use(express.json());

// ── Rutas ────────────────────────────────
// Todas las rutas de productos estarán bajo /api/products
app.use('/api/products', productRoutes);

// Ruta raíz para verificar que el servidor está vivo
app.get('/', (req, res) => {
  res.json({ message: '🚀 API de Product Manager funcionando' });
});

module.exports = app;