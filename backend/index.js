// Cargamos las variables de entorno PRIMERO (antes que todo)
require('dotenv').config();

const app = require('./src/app');

// Leemos el puerto del .env o usamos 3000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});