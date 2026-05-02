// Importamos la conexión a la base de datos
const pool = require('../db/connection');

// ─────────────────────────────────────────
// GET /api/products — Obtener todos los productos
// ─────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    // Ejecutamos la consulta SQL y esperamos el resultado
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');

    // Respondemos con los datos en formato JSON
    res.json(rows);
  } catch (error) {
    // Si algo falla, respondemos con error 500 (error del servidor)
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

// ─────────────────────────────────────────
// GET /api/products/:id — Obtener un producto por ID
// ─────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    // req.params.id extrae el ID de la URL (ej: /api/products/3)
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    // Si no encontró ningún producto con ese ID
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // rows[0] porque solo esperamos un resultado
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

// ─────────────────────────────────────────
// POST /api/products — Crear un nuevo producto
// ─────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    // req.body contiene los datos enviados por el cliente (JSON)
    const { name, description, price, stock } = req.body;

    // Validación básica: todos los campos son obligatorios
    if (!name || !description || !price || !stock) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Insertamos el nuevo producto (el ? evita inyección SQL)
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name, description, price, stock]
    );

    // Respondemos con 201 (recurso creado) y el ID generado
    res.status(201).json({
      message: 'Producto creado exitosamente',
      productId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
};

// ─────────────────────────────────────────
// PUT /api/products/:id — Actualizar un producto
// ─────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price || !stock) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
      [name, description, price, stock, id]
    );

    // affectedRows indica cuántas filas fueron modificadas
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

// ─────────────────────────────────────────
// DELETE /api/products/:id — Eliminar un producto
// ─────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};

// Exportamos todas las funciones para usarlas en las rutas
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};