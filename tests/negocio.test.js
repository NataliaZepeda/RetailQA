const {
  calcularTotal,
  esCantidadValida,
  haySuficienteStock,
  esPasswordValida,
  esRolValido,
  esEstadoPedidoValido
} = require('../lib/negocio');

describe('calcularTotal', () => {
  test('suma correctamente varios ítems con precio y cantidad', () => {
    const items = [
      { precio: 1000, cantidad: 2 },
      { precio: 500, cantidad: 3 }
    ];
    expect(calcularTotal(items)).toBe(3500);
  });

  test('devuelve 0 con un carrito vacío', () => {
    expect(calcularTotal([])).toBe(0);
  });

  test('redondea correctamente a 2 decimales', () => {
    const items = [{ precio: 10.005, cantidad: 1 }];
    expect(calcularTotal(items)).toBe(10.01);
  });

  test('ignora ítems con precio o cantidad no numéricos', () => {
    const items = [
      { precio: 1000, cantidad: 1 },
      { precio: 'no-numero', cantidad: 2 }
    ];
    expect(calcularTotal(items)).toBe(1000);
  });

  test('devuelve 0 si el argumento no es un array', () => {
    expect(calcularTotal(null)).toBe(0);
    expect(calcularTotal(undefined)).toBe(0);
    expect(calcularTotal('no-es-array')).toBe(0);
  });
});

describe('esCantidadValida (particionamiento de equivalencia + valores límite)', () => {
  // Clase válida
  test('acepta 1 (límite inferior válido)', () => {
    expect(esCantidadValida(1)).toBe(true);
  });

  test('acepta un entero positivo normal (5)', () => {
    expect(esCantidadValida(5)).toBe(true);
  });

  // Clase inválida - valores límite
  test('rechaza 0 (justo bajo el límite)', () => {
    expect(esCantidadValida(0)).toBe(false);
  });

  test('rechaza números negativos (-1)', () => {
    expect(esCantidadValida(-1)).toBe(false);
  });

  // Clase inválida - tipos no numéricos / decimales
  test('rechaza decimales (1.5)', () => {
    expect(esCantidadValida(1.5)).toBe(false);
  });

  test('rechaza strings no numéricos', () => {
    expect(esCantidadValida('abc')).toBe(false);
  });

  test('rechaza null y undefined', () => {
    expect(esCantidadValida(null)).toBe(false);
    expect(esCantidadValida(undefined)).toBe(false);
  });

  test('acepta un string numérico válido ("3")', () => {
    expect(esCantidadValida('3')).toBe(true);
  });
});

describe('haySuficienteStock (valores límite)', () => {
  test('true cuando la cantidad es exactamente igual al stock (límite)', () => {
    expect(haySuficienteStock(5, 5)).toBe(true);
  });

  test('true cuando la cantidad es menor al stock', () => {
    expect(haySuficienteStock(3, 5)).toBe(true);
  });

  test('false cuando la cantidad excede el stock por 1 (límite)', () => {
    expect(haySuficienteStock(6, 5)).toBe(false);
  });

  test('false cuando el stock es 0 y se pide al menos 1', () => {
    expect(haySuficienteStock(1, 0)).toBe(false);
  });

  test('false con valores no enteros', () => {
    expect(haySuficienteStock(1.5, 5)).toBe(false);
    expect(haySuficienteStock(1, 'cinco')).toBe(false);
  });
});

describe('esPasswordValida (valores límite: 6 caracteres mínimo)', () => {
  test('rechaza contraseña de 5 caracteres (justo bajo el límite)', () => {
    expect(esPasswordValida('12345')).toBe(false);
  });

  test('acepta contraseña de exactamente 6 caracteres (límite)', () => {
    expect(esPasswordValida('123456')).toBe(true);
  });

  test('acepta contraseña más larga que el mínimo', () => {
    expect(esPasswordValida('claveSegura123')).toBe(true);
  });

  test('rechaza contraseña vacía', () => {
    expect(esPasswordValida('')).toBe(false);
  });

  test('rechaza valores que no son string', () => {
    expect(esPasswordValida(123456)).toBe(false);
    expect(esPasswordValida(null)).toBe(false);
    expect(esPasswordValida(undefined)).toBe(false);
  });
});

describe('esRolValido (particionamiento de equivalencia)', () => {
  test('acepta "cliente"', () => {
    expect(esRolValido('cliente')).toBe(true);
  });

  test('acepta "admin"', () => {
    expect(esRolValido('admin')).toBe(true);
  });

  test('rechaza un rol inexistente', () => {
    expect(esRolValido('superadmin')).toBe(false);
  });

  test('rechaza mayúsculas distintas ("Admin" no es "admin")', () => {
    expect(esRolValido('Admin')).toBe(false);
  });

  test('rechaza vacío, null o undefined', () => {
    expect(esRolValido('')).toBe(false);
    expect(esRolValido(null)).toBe(false);
    expect(esRolValido(undefined)).toBe(false);
  });
});

describe('esEstadoPedidoValido (particionamiento de equivalencia)', () => {
  test.each(['pendiente', 'pagado', 'enviado', 'cancelado'])(
    'acepta el estado válido "%s"',
    (estado) => {
      expect(esEstadoPedidoValido(estado)).toBe(true);
    }
  );

  test('rechaza un estado inventado', () => {
    expect(esEstadoPedidoValido('en-camino-al-espacio')).toBe(false);
  });

  test('rechaza vacío o null', () => {
    expect(esEstadoPedidoValido('')).toBe(false);
    expect(esEstadoPedidoValido(null)).toBe(false);
  });
});
