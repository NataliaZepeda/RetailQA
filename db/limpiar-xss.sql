-- Limpia el payload XSS en el pedido #3 (dirección de envío)
UPDATE retailqa_pedidos
SET direccion_envio = 'Dirección de prueba'
WHERE id = 3;

-- Limpia el payload XSS en el usuario de prueba #2 (nombre)
UPDATE retailqa_usuarios
SET nombre = 'Usuario de Prueba XSS'
WHERE id = 2;
