const mensajeDiv = document.getElementById('mensaje');
const tabla = document.getElementById('tabla-productos');
const form = document.getElementById('form-producto');
const selectCategoria = document.getElementById('categoria_id');
const btnCancelar = document.getElementById('btn-cancelar');
const tituloForm = document.getElementById('titulo-form');
const btnGuardar = document.getElementById('btn-guardar');

function mostrarMensaje(texto, tipo) {
  mensajeDiv.textContent = texto;
  mensajeDiv.className = `mensaje ${tipo}`;
  setTimeout(() => mensajeDiv.classList.add('oculto'), 3000);
}

async function verificarAdmin() {
  try {
    const { usuario } = await api('GET', '/auth/me');
    if (!usuario || usuario.rol !== 'admin') window.location.href = '/index.html';
  } catch {
    window.location.href = '/login.html';
  }
}

async function cargarCategorias() {
  const { categorias } = await api('GET', '/productos/categorias/todas');
  selectCategoria.innerHTML = '<option value="">Sin categoría</option>';
  categorias.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nombre;
    selectCategoria.appendChild(opt);
  });
}

async function cargarProductos() {
  const { productos } = await api('GET', '/admin/productos');
  tabla.innerHTML = productos.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${escapeHtml(p.nombre)}</td>
      <td>${formatoCLP(p.precio)}</td>
      <td>${p.stock}</td>
      <td>${escapeHtml(p.categoria_nombre) || '—'}</td>
      <td>${p.activo ? 'Sí' : 'No'}</td>
      <td class="acciones-fila">
        <button class="secundario" data-editar='${JSON.stringify(p).replace(/'/g, "&#39;")}'>Editar</button>
        <button class="peligro" data-eliminar="${p.id}">${p.activo ? 'Dar de baja' : 'Ya inactivo'}</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('[data-editar]').forEach((btn) => {
    btn.addEventListener('click', () => cargarEnFormulario(JSON.parse(btn.dataset.editar)));
  });
  document.querySelectorAll('[data-eliminar]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Dar de baja este producto?')) return;
      try {
        await api('DELETE', `/admin/productos/${btn.dataset.eliminar}`);
        mostrarMensaje('Producto dado de baja.', 'exito');
        cargarProductos();
      } catch (err) {
        mostrarMensaje(err.message, 'error');
      }
    });
  });
}

function cargarEnFormulario(producto) {
  document.getElementById('producto-id').value = producto.id;
  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('descripcion').value = producto.descripcion || '';
  document.getElementById('precio').value = producto.precio;
  document.getElementById('stock').value = producto.stock;
  selectCategoria.value = producto.categoria_id || '';
  document.getElementById('imagen_url').value = producto.imagen_url || '';
  tituloForm.textContent = `Editando: ${producto.nombre}`;
  btnGuardar.textContent = 'Guardar cambios';
  btnCancelar.classList.remove('oculto');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limpiarFormulario() {
  form.reset();
  document.getElementById('producto-id').value = '';
  tituloForm.textContent = 'Nuevo producto';
  btnGuardar.textContent = 'Crear producto';
  btnCancelar.classList.add('oculto');
}

btnCancelar.addEventListener('click', limpiarFormulario);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('producto-id').value;
  const cuerpo = {
    nombre: document.getElementById('nombre').value,
    descripcion: document.getElementById('descripcion').value,
    precio: parseFloat(document.getElementById('precio').value),
    stock: parseInt(document.getElementById('stock').value, 10),
    categoria_id: selectCategoria.value || null,
    imagen_url: document.getElementById('imagen_url').value || null
  };

  try {
    if (id) {
      await api('PUT', `/admin/productos/${id}`, { ...cuerpo, activo: 1 });
      mostrarMensaje('Producto actualizado.', 'exito');
    } else {
      await api('POST', '/admin/productos', cuerpo);
      mostrarMensaje('Producto creado.', 'exito');
    }
    limpiarFormulario();
    cargarProductos();
  } catch (err) {
    mostrarMensaje(err.message, 'error');
  }
});

(async () => {
  await verificarAdmin();
  await cargarCategorias();
  await cargarProductos();
})();
