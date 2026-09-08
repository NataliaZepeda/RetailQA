const listaDiv = document.getElementById('lista-carrito');
const totalDiv = document.getElementById('total-carrito');
const mensajeDiv = document.getElementById('mensaje');
const seccionCheckout = document.getElementById('seccion-checkout');

function mostrarMensaje(texto, tipo) {
  mensajeDiv.textContent = texto;
  mensajeDiv.className = `mensaje ${tipo}`;
  mensajeDiv.classList.remove('oculto');
}

async function cargarCarrito() {
  try {
    const { items, total } = await api('GET', '/carrito');
    if (items.length === 0) {
      listaDiv.innerHTML = '<p>Tu carrito está vacío. <a href="/index.html">Ir al catálogo</a></p>';
      totalDiv.textContent = '';
      seccionCheckout.classList.add('oculto');
      return;
    }
    seccionCheckout.classList.remove('oculto');
    listaDiv.innerHTML = '';
    items.forEach((item) => {
      const fila = document.createElement('div');
      fila.className = 'fila-carrito';
      fila.innerHTML = `
        <img class="miniatura" src="${item.imagen_url || 'https://placehold.co/100x100/5B564F/FAF7F1?font=roboto&text=RQA'}" alt="${escapeHtml(item.nombre)}">
        <div>
          <strong>${escapeHtml(item.nombre)}</strong><br>
          <span>${formatoCLP(item.precio)} c/u</span>
        </div>
        <div class="acciones-fila">
          <input type="number" class="cantidad-input" value="${item.cantidad}" min="1" max="${item.stock}" data-item="${item.item_id}">
          <button class="secundario" data-actualizar="${item.item_id}">Actualizar</button>
          <button class="peligro" data-eliminar="${item.item_id}">Eliminar</button>
        </div>
        <div class="precio-tag">${formatoCLP(item.precio * item.cantidad)}</div>
      `;
      listaDiv.appendChild(fila);
    });
    totalDiv.textContent = `Total: ${formatoCLP(total)}`;

    document.querySelectorAll('[data-actualizar]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const itemId = btn.dataset.actualizar;
        const input = document.querySelector(`.cantidad-input[data-item="${itemId}"]`);
        try {
          await api('PUT', `/carrito/${itemId}`, { cantidad: parseInt(input.value, 10) });
          mostrarMensaje('Cantidad actualizada.', 'exito');
          cargarCarrito();
        } catch (err) {
          mostrarMensaje(err.message, 'error');
        }
      });
    });

    document.querySelectorAll('[data-eliminar]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await api('DELETE', `/carrito/${btn.dataset.eliminar}`);
          cargarCarrito();
        } catch (err) {
          mostrarMensaje(err.message, 'error');
        }
      });
    });
  } catch (err) {
    if (err.message.includes('iniciar sesión')) {
      listaDiv.innerHTML = '<p>Debes <a href="/login.html">iniciar sesión</a> para ver tu carrito.</p>';
      seccionCheckout.classList.add('oculto');
    } else {
      listaDiv.innerHTML = `<p>Error al cargar el carrito: ${err.message}</p>`;
    }
  }
}

document.getElementById('btn-checkout').addEventListener('click', async () => {
  const direccion = document.getElementById('direccion-envio').value;
  try {
    const resultado = await api('POST', '/pedidos/checkout', { direccion_envio: direccion });
    mostrarMensaje(`Pedido #${resultado.pedido_id} confirmado por ${formatoCLP(resultado.total)}.`, 'exito');
    setTimeout(() => { window.location.href = '/pedidos.html'; }, 1500);
  } catch (err) {
    mostrarMensaje(err.message, 'error');
  }
});

cargarCarrito();
