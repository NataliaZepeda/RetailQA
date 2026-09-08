/**
 * Lógica de negocio pura de RetailQA, sin dependencias de Express ni de la
 * base de datos. Se extrae aquí para poder probarla con tests unitarios
 * reales (sin levantar servidor ni conexión a MySQL).
 */

/**
 * Calcula el total de una lista de ítems (carrito o pedido).
 * @param {Array<{precio: number, cantidad: number}>} items
 * @returns {number} Total, redondeado a 2 decimales.
 */
function calcularTotal(items) {
  if (!Array.isArray(items)) return 0;
  const total = items.reduce((acc, item) => {
    const precio = Number(item.precio);
    const cantidad = Number(item.cantidad);
    if (Number.isNaN(precio) || Number.isNaN(cantidad)) return acc;
    return acc + precio * cantidad;
  }, 0);
  return Math.round(total * 100) / 100;
}

/**
 * Valida que una cantidad sea un entero positivo (>= 1).
 * @param {*} cantidad
 * @returns {boolean}
 */
function esCantidadValida(cantidad) {
  const n = Number(cantidad);
  return Number.isInteger(n) && n >= 1;
}

/**
 * Verifica que haya stock suficiente para una cantidad solicitada.
 * @param {number} cantidadSolicitada
 * @param {number} stockDisponible
 * @returns {boolean}
 */
function haySuficienteStock(cantidadSolicitada, stockDisponible) {
  const cantidad = Number(cantidadSolicitada);
  const stock = Number(stockDisponible);
  if (!Number.isInteger(cantidad) || !Number.isInteger(stock)) return false;
  return cantidad <= stock;
}

/**
 * Valida que una contraseña cumpla el largo mínimo exigido (6 caracteres).
 * @param {string} password
 * @returns {boolean}
 */
function esPasswordValida(password) {
  return typeof password === 'string' && password.length >= 6;
}

const ROLES_VALIDOS = ['cliente', 'admin'];

/**
 * Valida que un rol sea uno de los roles permitidos del sistema.
 * @param {string} rol
 * @returns {boolean}
 */
function esRolValido(rol) {
  return ROLES_VALIDOS.includes(rol);
}

const ESTADOS_PEDIDO_VALIDOS = ['pendiente', 'pagado', 'enviado', 'cancelado'];

/**
 * Valida que un estado de pedido sea uno de los estados permitidos.
 * @param {string} estado
 * @returns {boolean}
 */
function esEstadoPedidoValido(estado) {
  return ESTADOS_PEDIDO_VALIDOS.includes(estado);
}

module.exports = {
  calcularTotal,
  esCantidadValida,
  haySuficienteStock,
  esPasswordValida,
  esRolValido,
  esEstadoPedidoValido,
  ROLES_VALIDOS,
  ESTADOS_PEDIDO_VALIDOS
};
