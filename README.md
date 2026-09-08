# RetailQA

Sitio de retail ficticio con backend real (Node.js + Express + MySQL), pensado como
ambiente de práctica de QA para el curso CIN 421 / INF423, con más superficie de
prueba que TiendaQA: autenticación, sesiones, carrito persistente en base de datos,
checkout con transacciones, panel de administración con roles, e historial de pedidos.

Sin bugs plantados por ahora — sitio limpio y funcional. Se pueden agregar bugs
intencionales después, como se hizo en TiendaQA.

## Estructura

```
retailqa/
├── server.js                # Punto de entrada (Express)
├── config/db.js             # Pool de conexión MySQL
├── middleware/auth.js       # requireAuth / requireAdmin
├── routes/
│   ├── auth.js              # /api/auth  (registro, login, logout, me)
│   ├── productos.js         # /api/productos (catálogo público)
│   ├── carrito.js           # /api/carrito (requiere sesión)
│   ├── pedidos.js           # /api/pedidos (checkout + historial, requiere sesión)
│   └── admin.js             # /api/admin  (productos, usuarios/roles, pedidos - requiere rol admin)
├── db/
│   ├── schema.sql           # Crea las tablas (prefijo retailqa_)
│   ├── seed.sql             # Categorías y productos de ejemplo
│   └── crear-admin.js       # Script para crear el primer usuario admin
└── public/                  # Frontend estático (HTML/CSS/JS vanilla)
    ├── index.html            # Catálogo
    ├── login.html / registro.html
    ├── carrito.html
    ├── pedidos.html          # Historial del cliente
    └── admin/                 # Panel de administración
        ├── index.html
        ├── productos.html
        ├── usuarios.html
        └── pedidos.html
```

## Roles

- **cliente**: navega el catálogo, gestiona su carrito, hace checkout y ve su
  propio historial de pedidos.
- **admin**: además puede crear/editar/dar de baja productos, ver todos los
  pedidos y cambiar su estado, y asignar el rol admin a otros usuarios.

## Despliegue en cPanel (TecnoWeb)

### 1. Crear la base de datos

En cPanel → **MySQL® Databases**, crea una base de datos (o reutiliza la que ya
usas para TestLink/Mantis). Anota el nombre completo con prefijo de cPanel
(ej. `usuario_retailqa`), el usuario y la contraseña, y asegúrate de que el
usuario tenga todos los privilegios sobre la base de datos.

### 2. Cargar el esquema

En **phpMyAdmin**, selecciona la base de datos y ejecuta en este orden:
1. `db/schema.sql` (crea las tablas)
2. `db/seed.sql` (carga categorías y productos de ejemplo)

### 3. Subir el proyecto

Sube la carpeta `retailqa/` completa (sin `node_modules/`) a tu cuenta de
hosting, por ejemplo a `~/retailqa` (fuera de `public_html`, cPanel la sirve
desde la ruta que definas en el paso siguiente).

### 4. Crear la aplicación Node.js

En cPanel → **Setup Node.js App** → **Create Application**:
- **Node.js version**: la más reciente disponible (18 o superior)
- **Application mode**: Production
- **Application root**: `retailqa` (la carpeta que subiste)
- **Application URL**: `retailqa.pruebasdesistemauv.com` (el subdominio debe
  existir antes — créalo en **Domains** o **Subdomains** si aún no existe)
- **Application startup file**: `server.js`

Guarda. cPanel generará un comando para activar el entorno virtual de Node
(algo como `source /home/usuario/nodevenv/retailqa/18/bin/activate`).

### 5. Variables de entorno

En la misma pantalla de la aplicación, en **Environment Variables**, agrega:

| Variable        | Valor                                    |
|------------------|-------------------------------------------|
| `DB_HOST`        | `localhost`                               |
| `DB_USER`        | tu usuario de MySQL de cPanel             |
| `DB_PASSWORD`    | tu contraseña de MySQL                    |
| `DB_NAME`        | el nombre completo de la BD (con prefijo) |
| `DB_PORT`        | `3306`                                    |
| `SESSION_SECRET` | una cadena aleatoria larga                |

(No necesitas definir `PORT`: cPanel lo asigna automáticamente a través de
Passenger).

### 6. Instalar dependencias

Desde la terminal SSH de cPanel (o el botón "Run NPM Install" en la pantalla
de Setup Node.js App):

```bash
cd ~/retailqa
source /home/usuario/nodevenv/retailqa/18/bin/activate   # el comando exacto lo da cPanel
npm install
```

### 7. Crear el usuario administrador

Con las dependencias ya instaladas y el `.env` (o las variables de entorno de
cPanel) configuradas:

```bash
node db/crear-admin.js "Nombre Admin" admin@retailqa.cl ClaveSegura123
```

### 8. Iniciar / reiniciar la aplicación

En **Setup Node.js App**, presiona **Restart**. Luego visita
`https://retailqa.pruebasdesistemauv.com` para verificar que el catálogo cargue.

## Desarrollo local

```bash
cp .env.example .env      # completa con datos de una BD MySQL local o remota
npm install
npm start
```

El sitio quedará disponible en `http://localhost:3000`.
