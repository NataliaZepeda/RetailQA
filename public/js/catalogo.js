const grid = document.getElementById('grid-productos');
const chipsContenedor = document.getElementById('chips-categoria');
const inputBuscar = document.getElementById('filtro-buscar');
const mensajeDiv = document.getElementById('mensaje');

let categoriaActiva = '';

function mostrarMensaje(texto, tipo) {
  mensajeDiv.textContent = texto;
  mensajeDiv.className = `mensaje ${tipo}`;
  setTimeout(() => mensajeDiv.classList.add('oculto'), 3000);
}

async function cargarCategorias() {
  try {
    const { categorias } = await api('GET', '/productos/categorias/todas');
    categorias.forEach((cat) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = cat.nombre;
      chip.dataset.categoria = cat.id;
      chip.addEventListener('click', () => seleccionarCategoria(cat.id, chip));
      chipsContenedor.appendChild(chip);
    });
    // Chip "Todas"
    chipsContenedor.querySelector('[data-categoria=""]').addEventListener('click', (e) => {
      seleccionarCategoria('', e.target);
    });
  } catch (err) {
    console.error('Error al cargar categorías:', err);
  }
}

function seleccionarCategoria(id, chipEl) {
  categoriaActiva = id;
  document.querySelectorAll('.chip').forEach((c) => c.classList.remove('activo'));
  chipEl.classList.add('activo');
  cargarProductos();
}

async function cargarProductos() {
  const params = new URLSearchParams();
  if (categoriaActiva) params.set('categoria_id', categoriaActiva);
  if (inputBuscar.value.trim()) params.set('buscar', inputBuscar.value.trim());

  try {
    const { productos } = await api('GET', `/productos?${params.toString()}`);
    grid.innerHTML = '';
    if (productos.length === 0) {
      grid.innerHTML = '<p>No se encontraron productos.</p>';
      return;
    }
    productos.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'card';
      const stockBajo = p.stock > 0 && p.stock <= 5;
      card.innerHTML = `
        <div class="card-imagen-wrap">
          <img src="${p.imagen_url || 'https://placehold.co/600x450/5B564F/FAF7F1?font=roboto&text=RetailQA'}" alt="${escapeHtml(p.nombre)}" loading="lazy">
          ${stockBajo ? `<span class="badge-stock">¡Últimas ${p.stock}!</span>` : ''}
          ${p.stock === 0 ? `<span class="badge-stock">Sin stock</span>` : ''}
        </div>
        <div class="card-cuerpo">
          <span class="categoria-label">${escapeHtml(p.categoria_nombre) || 'General'}</span>
          <h3>${escapeHtml(p.nombre)}</h3>
          <p class="descripcion">${escapeHtml(p.descripcion) || ''}</p>
          <span class="precio-tag">${formatoCLP(p.precio)}</span>
          <span class="stock-info ${stockBajo ? 'stock-bajo' : ''}">${p.stock === 0 ? '' : `Stock: ${p.stock}`}</span>
          <label>Cantidad
            <input type="number" class="cantidad-input" value="1" min="1" max="${p.stock}" ${p.stock === 0 ? 'disabled' : ''}>
          </label>
          <button ${p.stock === 0 ? 'disabled' : ''} data-id="${p.id}">
            ${p.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>
      `;
      const boton = card.querySelector('button');
      const inputCantidad = card.querySelector('.cantidad-input');
      boton.addEventListener('click', () => agregarAlCarrito(p.id, inputCantidad.value));
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = `<p>Error al cargar productos: ${err.message}</p>`;
  }
}

async function agregarAlCarrito(productoId, cantidad) {
  try {
    await api('POST', '/carrito/agregar', { producto_id: productoId, cantidad: parseInt(cantidad, 10) });
    mostrarMensaje('Producto agregado al carrito.', 'exito');
  } catch (err) {
    if (err.message.includes('iniciar sesión')) {
      mostrarMensaje('Debes iniciar sesión para agregar productos al carrito.', 'error');
    } else {
      mostrarMensaje(err.message, 'error');
    }
  }
}

inputBuscar.addEventListener('input', () => {
  clearTimeout(window._debounceBuscar);
  window._debounceBuscar = setTimeout(cargarProductos, 300);
});

cargarCategorias();
cargarProductos();
