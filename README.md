# 📦 Product Manager

Sistema de gestión de productos con operaciones CRUD completas.
Construido con Node.js, Express y MySQL.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Funcionalidades

- ✅ Crear productos
- ✅ Listar todos los productos
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Validaciones en frontend y backend
- ✅ Indicadores de stock con colores

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Node.js + Express |
| Base de datos | MySQL |
| Frontend | HTML, CSS, JavaScript |
| Conector BD | mysql2 |
| Variables de entorno | dotenv |

---

## 📁 Estructura del proyecto

```
product-manager/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── product.controller.js
│   │   ├── routes/
│   │   │   └── product.routes.js
│   │   └── db/
│   │       └── connection.js
│   ├── src/app.js
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── index.html
│
└── README.md
```

---

## ⚙️ Instalación y uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/product-manager.git
cd product-manager
```

### 2. Instalar dependencias
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus datos de MySQL
```

### 4. Crear la base de datos
Ejecuta el siguiente SQL en MySQL:

```sql
CREATE DATABASE IF NOT EXISTS product_manager_db;
USE product_manager_db;

CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)   NOT NULL,
  description TEXT           NOT NULL,
  price       DECIMAL(10,2)  NOT NULL,
  stock       INT            NOT NULL DEFAULT 0,
  created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5. Iniciar el servidor
```bash
npm run dev
```

### 6. Abrir el frontend
Abre `frontend/index.html` en tu navegador.

---

## 🔌 Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/products` | Obtener todos los productos |
| GET | `/api/products/:id` | Obtener un producto por ID |
| POST | `/api/products` | Crear un nuevo producto |
| PUT | `/api/products/:id` | Actualizar un producto |
| DELETE | `/api/products/:id` | Eliminar un producto |

---

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [MARVIN ALEXANDER MUÑOZ GONZALEZ](https://github.com/munozgonzalezmarvinalexander-ai
)

---

## 📄 Licencia

MIT