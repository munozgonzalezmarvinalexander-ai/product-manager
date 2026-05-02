// Importamos mysql2 con soporte para Promises (async/await)
const mysql = require('mysql2/promise');

// Cargamos las variables del archivo .env
require('dotenv').config();

// Creamos un "pool" de conexiones
// Un pool es más eficiente que una sola conexión:
// reutiliza conexiones en lugar de abrir y cerrar una cada vez
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // localhost
  user: process.env.DB_USER,         // root
  password: process.env.DB_PASSWORD, // tu contraseña
  database: process.env.DB_NAME,     // product_manager_db
  waitForConnections: true,          // espera si todas las conexiones están ocupadas
  connectionLimit: 10,               // máximo 10 conexiones simultáneas
  queueLimit: 0                      // sin límite de solicitudes en cola
});

// Exportamos el pool para usarlo en otros archivos
module.exports = pool;