-- ============================================================
-- RetailQA - Localizar el dato con el payload XSS almacenado
-- Ejecutar en phpMyAdmin, pestaña "SQL", para encontrar dónde
-- quedó guardado el <script>alert(1)</script> (u otro payload).
-- ============================================================

SELECT id, direccion_envio, usuario_id, created_at
FROM retailqa_pedidos
WHERE direccion_envio LIKE '%<script%' OR direccion_envio LIKE '%<%';

SELECT id, nombre, correo, created_at
FROM retailqa_usuarios
WHERE nombre LIKE '%<script%' OR nombre LIKE '%<%';

SELECT id, nombre, descripcion
FROM retailqa_productos
WHERE nombre LIKE '%<script%' OR descripcion LIKE '%<script%';

-- Una vez identificada la fila, puedes limpiarla manualmente, por ejemplo:
-- UPDATE retailqa_pedidos SET direccion_envio = 'Dirección de prueba' WHERE id = <el_id_encontrado>;
-- UPDATE retailqa_usuarios SET nombre = 'Usuario de prueba' WHERE id = <el_id_encontrado>;
