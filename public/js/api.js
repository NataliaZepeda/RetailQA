// Wrapper simple sobre fetch para la API de RetailQA
async function api(metodo, ruta, body) {
  const opciones = {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin'
  };
  if (body !== undefined) {
    opciones.body = JSON.stringify(body);
  }
  const respuesta = await fetch(`/api${ruta}`, opciones);
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new Error(datos.error || `Error ${respuesta.status}`);
  }
  return datos;
}

function formatoCLP(valor) {
  return '$' + Number(valor).toLocaleString('es-CL');
}

// Escapa HTML para prevenir XSS al insertar texto proveniente de datos
// del usuario (nombres, direcciones, descripciones, etc.) dentro de innerHTML.
function escapeHtml(texto) {
  if (texto === null || texto === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(texto);
  return div.innerHTML;
}

// Renderiza el menú de navegación según si hay sesión activa y el rol del usuario
async function renderizarNav() {
  const contenedor = document.getElementById('nav-sesion');
  if (!contenedor) return;

  try {
    const { usuario } = await api('GET', '/auth/me');
    if (usuario) {
      let extra = `<a href="/pedidos.html">Mis pedidos</a>`;
      if (usuario.rol === 'admin') {
        extra += `<a href="/admin/index.html">Panel admin</a>`;
      }
      contenedor.innerHTML = `
        <a href="/carrito.html">Carrito</a>
        ${extra}
        <span style="color:#C9A227;">Hola, ${escapeHtml(usuario.nombre)}</span>
        <a href="#" id="cerrar-sesion">Cerrar sesión</a>
      `;
      document.getElementById('cerrar-sesion').addEventListener('click', async (e) => {
        e.preventDefault();
        await api('POST', '/auth/logout');
        window.location.href = '/index.html';
      });
    } else {
      contenedor.innerHTML = `
        <a href="/carrito.html">Carrito</a>
        <a href="/login.html">Ingresar</a>
        <a href="/registro.html">Crear cuenta</a>
      `;
    }
  } catch (err) {
    console.error('No se pudo cargar la sesión:', err);
  }
}

document.addEventListener('DOMContentLoaded', renderizarNav);
