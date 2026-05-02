const API_URL = 'https://product-manager-production-a2a0.up.railway.app/api/products';

async function loadProducts() {
  const tbody = document.getElementById('products-table');
  tbody.innerHTML = `<tr><td colspan="6" class="loading">⏳ Cargando productos...</td></tr>`;

  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty">📭 No hay productos registrados</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(product => `
      <tr>
        <td>#${product.id}</td>
        <td><strong>${product.name}</strong></td>
        <td>${product.description}</td>
        <td class="price">Q ${parseFloat(product.price).toFixed(2)}</td>
        <td>${getStockBadge(product.stock)}</td>
        <td>
          <div class="actions">
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
    tbody.innerHTML = `<tr><td colspan="6" class="empty">❌ Error al conectar con la API. ¿Está el servidor corriendo?</td></tr>`;
  }
}

async function saveProduct() {
  const id          = document.getElementById('product-id').value;
  const name        = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const price       = document.getElementById('price').value;
  const stock       = document.getElementById('stock').value;

  if (!name || !description || !price || !stock) {
    showAlert('⚠️ Por favor completa todos los campos', 'error');
    return;
  }

  const productData = { name, description, price: parseFloat(price), stock: parseInt(stock) };

  try {
    let response;

    if (id) {
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    } else {
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
      loadProducts();
    } else {
      showAlert(`❌ ${data.message}`, 'error');
    }

  } catch (error) {
    showAlert('❌ Error al conectar con la API', 'error');
  }
}

function editProduct(id, name, description, price, stock) {
  document.getElementById('product-id').value    = id;
  document.getElementById('name').value          = name;
  document.getElementById('description').value   = description;
  document.getElementById('price').value         = price;
  document.getElementById('stock').value         = stock;
  document.getElementById('form-title').textContent   = '✏️ Editar Producto';
  document.getElementById('btn-cancel').style.display = 'inline-block';
  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

async function deleteProduct(id, name) {
  if (!confirm(`¿Estás seguro de eliminar "${name}"? Esta acción no se puede deshacer.`)) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok) {
      showAlert(`✅ "${name}" eliminado exitosamente`, 'success');
      loadProducts();
    } else {
      showAlert(`❌ ${data.message}`, 'error');
    }

  } catch (error) {
    showAlert('❌ Error al conectar con la API', 'error');
  }
}

function cancelEdit() { clearForm(); }

function clearForm() {
  document.getElementById('product-id').value   = '';
  document.getElementById('name').value         = '';
  document.getElementById('description').value  = '';
  document.getElementById('price').value        = '';
  document.getElementById('stock').value        = '';
  document.getElementById('form-title').textContent   = '➕ Nuevo Producto';
  document.getElementById('btn-cancel').style.display = 'none';
}

function showAlert(message, type) {
  const alert = document.getElementById('alert');
  alert.textContent   = message;
  alert.className     = `alert alert-${type}`;
  alert.style.display = 'block';
  setTimeout(() => { alert.style.display = 'none'; }, 3000);
}

function getStockBadge(stock) {
  if (stock === 0) return `<span class="stock-badge stock-zero">Sin stock</span>`;
  if (stock <= 5)  return `<span class="stock-badge stock-low">${stock} unidades</span>`;
  return             `<span class="stock-badge stock-ok">${stock} unidades</span>`;
}

function escapeSingleQuotes(str) {
  return str ? str.replace(/'/g, "\\'") : '';
}

loadProducts();