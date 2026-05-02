// Router es el módulo de Express para manejar rutas
const { Router } = require('express');
const router = Router();

// Importamos todas las funciones del controller
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

// ─────────────────────────────────────────
// Definición de rutas
// Método HTTP  →  URL                  →  Función
// ─────────────────────────────────────────
router.get('/',        getAllProducts);    // GET    /api/products
router.get('/:id',     getProductById);   // GET    /api/products/1
router.post('/',       createProduct);    // POST   /api/products
router.put('/:id',     updateProduct);    // PUT    /api/products/1
router.delete('/:id',  deleteProduct);    // DELETE /api/products/1

module.exports = router;