// URL base de la API (si cambias el puerto, solo cambias aquí)
// ✅ Reemplaza la línea actual por esta:
const API_URL = 'https://product-manager-production-a2a0.up.railway.app/api/products';

// ─────────────────────────────────────────────────
// LEER — Cargar todos los productos y mostrarlos
// ─────────────────────────────────────────────────
async function loadProducts() {
  const tbody = document.getElementById('products-table');
  tbody.innerHTML = `<tr><td colspan="6" class="loading">⏳ Cargando productos...</td></tr>`;

  try {
    // fetch() hace una petición HTTP GET a la API
    const response = await fetch(API_URL);
    const products = await response.json();

    // Si no hay productos, mostramos mensaje
    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty">📭 No hay productos registrados</td></tr>`;
      return;
    }

    // Construimos las filas de la tabla con un map
    tbody.innerHTML = products.map(product => `
      <tr>
        <td>#${product.id}</td>
        <td><strong>${product.name}</strong></td>
        <td>${product.description}</td>
        <td class="price">Q ${parseFloat(product.price).toFixed(2)}</td>
        <td>${getStockBadge(product.stock)}</td>
        <td>
          <div class="actions">
            <!-- Pasamos los datos del producto a las funciones de editar/eliminar -->
            <button class="btn-edit" onclick="editProduct(${product.id}, '${escapeSingleQuotes(product.name)}', '${escapeSingleQuotes(product.description)}', ${product.price}, ${product.stock})">
              ✏️ Editar
            </button>
            <button class="btn-delete" onclick="deleteProduct(${product.id}, '${escapeSingleQuotes(product.name)}')">
              🗑️ Eliminar
            </button>
          </div>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    // Si la API no responde (servidor apagado, etc.)
    tbody.innerHTML = `<tr><td colspan="6" class="empty">❌ Error al conectar con la API. ¿Está el servidor corriendo?</td></tr>`;
  }
}

// ─────────────────────────────────────────────────
// CREAR o ACTUALIZAR — Guardar producto
// ─────────────────────────────────────────────────
async function saveProduct() {
  // Leemos los valores del formulario
  const id          = document.getElementById('product-id').value;
  const name        = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const price       = document.getElementById('price').value;
  const stock       = document.getElementById('stock').value;

  // Validación en el frontend (doble seguridad, ya validamos en el backend también)
  if (!name || !description || !price || !stock) {
    showAlert('⚠️ Por favor completa todos los campos', 'error');
    return;
  }

  // Armamos el objeto que enviaremos en el body
  const productData = { name, description, price: parseFloat(price), stock: parseInt(stock) };

  try {
    let response;

    if (id) {
      // Si hay ID → estamos EDITANDO (PUT)
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }, // le decimos que enviamos JSON
        body: JSON.stringify(productData)                 // convertimos el objeto a JSON
      });
    } else {
      // Si no hay ID → estamos CREANDO (POST)
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    }

    const data = await response.json();

    if (response.ok) {
      showAlert(id ? '✅ Producto actualizado exitosamente' : '✅ Producto creado exitosamente', 'success');
      clearForm();
      loadProducts(); // recargamos la tabla
    } else {
      showAlert(`❌ ${data.message}`, 'error');
    }

  } catch (error) {
    showAlert('❌ Error al conectar con la API', 'error');
  }
}

// ─────────────────────────────────────────────────
// EDITAR — Rellenar el formulario con los datos del producto
// ─────────────────────────────────────────────────
function editProduct(id, name, description, price, stock) {
  // Llenamos cada campo del formulario
  document.getElementById('product-id').value    = id;
  document.getElementById('name').value          = name;
  document.getElementById('description').value   = description;
  document.getElementById('price').value         = price;
  document.getElementById('stock').value         = stock;

  // Cambiamos el título y mostramos el botón cancelar
  document.getElementById('form-title').textContent  = '✏️ Editar Producto';
  document.getElementById('btn-cancel').style.display = 'inline-block';

  // Hacemos scroll suave hacia el formulario
  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// ─────────────────────────────────────────────────
// ELIMINAR — Borrar un producto por ID
// ─────────────────────────────────────────────────
async function deleteProduct(id, name) {
  // Pedimos confirmación antes de eliminar
  if (!confirm(`¿Estás seguro de eliminar "${name}"? Esta acción no se puede deshacer.`)) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok) {
      showAlert(`✅ "${name}" eliminado exitosamente`, 'success');
      loadProducts(); // recargamos la tabla
    } else {
      showAlert(`❌ ${data.message}`, 'error');
    }

  } catch (error) {
    showAlert('❌ Error al conectar con la API', 'error');
  }
}

// ─────────────────────────────────────────────────
// HELPERS — Funciones auxiliares
// ─────────────────────────────────────────────────

// Limpiar el formulario y volver al modo "crear"
function cancelEdit() {
  clearForm();
}

function clearForm() {
  document.getElementById('product-id').value   = '';
  document.getElementById('name').value         = '';
  document.getElementById('description').value  = '';
  document.getElementById('price').value        = '';
  document.getElementById('stock').value        = '';
  document.getElementById('form-title').textContent   = '➕ Nuevo Producto';
  document.getElementById('btn-cancel').style.display = 'none';
}

// Mostrar alerta temporal (desaparece en 3 segundos)
function showAlert(message, type) {
  const alert = document.getElementById('alert');
  alert.textContent    = message;
  alert.className      = `alert alert-${type}`;
  alert.style.display  = 'block';
  setTimeout(() => { alert.style.display = 'none'; }, 3000);
}

// Badge de color según el stock disponible
function getStockBadge(stock) {
  if (stock === 0)  return `<span class="stock-badge stock-zero">Sin stock</span>`;
  if (stock <= 5)   return `<span class="stock-badge stock-low">${stock} unidades</span>`;
  return              `<span class="stock-badge stock-ok">${stock} unidades</span>`;
}

// Evita que comillas simples en nombres rompan el HTML
function escapeSingleQuotes(str) {
  return str ? str.replace(/'/g, "\\'") : '';
}

// ─────────────────────────────────────────────────
// INICIO — Cargar productos al abrir la página
// ─────────────────────────────────────────────────
loadProducts();