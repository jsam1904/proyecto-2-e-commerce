# TiendaDB — Proyecto 2 | cc3062 Sistemas y Tecnologías Web

Sistema web para gestionar inventario y ventas de una tienda. Stack: **React + Node.js (Express) + PostgreSQL + Docker**.

## Demo en línea

https://proyecto-2-e-commerce-l52q.vercel.app/login

---

## Levantar el proyecto

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd Proyecto-2-DB

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Levantar todo
docker compose up -d
```

Si el comando falla con `container tienda_db is unhealthy`, espera unos segundos y corre:

```bash
docker compose up -d backend frontend
```

La app estará disponible en:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api
- **PostgreSQL:** localhost:5432

Para detener limpiamente:

```bash
docker compose stop    # detiene sin borrar contenedores
docker compose start   # reanuda sin necesidad de recuperación
```

---

## Despliegue en servidor

El proyecto está configurado para correr en cualquier servidor con Docker instalado. Nginx actúa como reverse proxy interno: las llamadas a `/api` se redirigen al backend dentro de la red Docker, por lo que **no se necesita cambiar ninguna URL**.

```bash
# En el servidor (Linux/Mac/Windows con Docker)
git clone <repo-url>
cd Proyecto-2-DB
cp .env.example .env
# Editar .env y cambiar JWT_SECRET por un valor seguro
docker compose up -d
```

La aplicación quedará disponible en `http://IP_DEL_SERVIDOR:3000`.

> Si quieres exponerla en el puerto 80 en vez del 3000, cambia `"3000:80"` por `"80:80"` en el `docker-compose.yml`.

**Requisitos del servidor:**

- Docker >= 24 y Docker Compose v2
- Puerto 3000 abierto en el firewall (o el que configures)

---

## Credenciales

### Base de datos

| Campo    | Valor                                 |
|----------|---------------------------------------|
| Usuario  | `proy2`                               |
| Password | `secret`                              |
| Base     | `tienda_db`                           |
| Host     | `localhost` / `db` (dentro de Docker) |

### Usuarios de la aplicación

Todos los usuarios comparten la contraseña: **`Password123!`**

| Usuario      | Rol        |
|--------------|------------|
| `dmorales`   | admin      |
| `ifuentes`   | bodeguero  |
| `laguilar`   | bodeguero  |
| `pestrada`   | bodeguero  |
| `fruiz`      | vendedor   |
| `hvasquez`   | vendedor   |
| `jmendez`    | vendedor   |
| `ksolis`     | vendedor   |
| `mbarrios`   | vendedor   |
| `ncruz`      | vendedor   |
| `odominguez` | vendedor   |
| `rflores`    | vendedor   |
| `sgarcia`    | vendedor   |
| `thernandez` | vendedor   |
| `uibanez`    | vendedor   |

---

## API REST

Base URL: `http://localhost:4000/api`

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <token>
```

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Login con usuario y contraseña, retorna JWT | No |
| GET | `/auth/me` | Datos del usuario autenticado | Sí |

**Body login:**
```json
{ "username": "dmorales", "password": "Password123!" }
```

**Respuesta login:**
```json
{ "token": "eyJ...", "user": { "id_usuario": 1, "username": "dmorales", "rol": "admin" } }
```

---

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/productos` | Lista todos los productos (JOIN categorías + proveedores) |
| GET | `/productos/:id` | Detalle de un producto |
| GET | `/productos/bajo-stock` | Productos con stock ≤ stock mínimo (subquery EXISTS) |
| POST | `/productos` | Crear producto |
| PUT | `/productos/:id` | Actualizar producto |
| DELETE | `/productos/:id` | Desactivar producto (soft delete) |

**Body POST/PUT:**
```json
{
  "nombre": "Laptop Dell",
  "descripcion": "Laptop empresarial",
  "id_categoria": 1,
  "id_proveedor": 2,
  "precio_compra": "3500.00",
  "precio_venta": "4800.00",
  "stock": 10,
  "stock_minimo": 2
}
```

---

### Ventas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/ventas` | Lista todas las ventas con totales y cantidad de ítems |
| GET | `/ventas/:id` | Encabezado + detalle de líneas de una venta |
| POST | `/ventas` | Crear venta (transacción explícita: verifica stock, descuenta, registra) |

**Body POST:**
```json
{
  "id_cliente": 1,
  "id_empleado": 3,
  "notas": "Venta en efectivo",
  "items": [
    { "id_producto": 5, "cantidad": 2 },
    { "id_producto": 8, "cantidad": 1 }
  ]
}
```

---

### Clientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/clientes` | Lista todos los clientes |
| GET | `/clientes/:id` | Detalle de un cliente |
| POST | `/clientes` | Crear cliente |
| PUT | `/clientes/:id` | Actualizar cliente |
| DELETE | `/clientes/:id` | Desactivar cliente (soft delete) |

**Body POST/PUT:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "5555-1234",
  "direccion": "Zona 10, Guatemala",
  "nit": "1234567-8"
}
```

---

### Empleados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/empleados` | Lista todos los empleados |
| GET | `/empleados/:id` | Detalle de un empleado |
| POST | `/empleados` | Crear empleado |
| PUT | `/empleados/:id` | Actualizar empleado |
| DELETE | `/empleados/:id` | Desactivar empleado (soft delete) |

---

### Categorías y Proveedores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/categorias` | Lista todas las categorías |
| POST | `/categorias` | Crear categoría |
| GET | `/proveedores` | Lista todos los proveedores |
| POST | `/proveedores` | Crear proveedor |

---

### Reportes (endpoints de agregación)

| Método | Endpoint | SQL utilizado | Descripción |
|--------|----------|---------------|-------------|
| GET | `/reportes/ventas-por-empleado` | GROUP BY + HAVING + AVG/SUM | Total de ventas y promedio por empleado |
| GET | `/reportes/ventas-por-categoria` | JOIN múltiple + GROUP BY | Ingresos agrupados por categoría |
| GET | `/reportes/top-clientes` | WITH CTE + RANK() OVER | Ranking de mejores clientes |
| GET | `/reportes/productos-sin-venta` | NOT IN (subquery) | Productos que nunca se han vendido |
| GET | `/reportes/resumen-mensual` | CTE + SUM() OVER ventana | Ingresos acumulados por mes |
| GET | `/reportes/vista-ventas` | VIEW `v_ventas_detalle` | Vista de todas las ventas con detalle |
| GET | `/reportes/top-productos` | VIEW `v_top_productos` | Productos más vendidos por cantidad |

---

### Manejo de errores

Todos los endpoints retornan errores en JSON con el código HTTP correspondiente:

| Código | Cuándo se usa |
|--------|---------------|
| 400 | Datos inválidos o faltantes |
| 401 | Token ausente o inválido |
| 403 | Sin permisos suficientes |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej. stock insuficiente) |
| 500 | Error interno del servidor |

```json
{ "error": "Stock insuficiente para el producto 'Laptop Dell'" }
```

---

## Linter y pruebas

```bash
# Entrar al contenedor del frontend (con docker)
docker exec -it tienda_frontend sh

# Ejecutar linter
npm run lint

# Ejecutar pruebas
npm run test
```

O localmente (requiere `npm install` previo):

```bash
cd frontend
npm install
npm run lint   # ESLint — debe terminar sin errores
npm run test   # Vitest — 7 pruebas en 2 archivos
```

---

## Arquitectura

```
Proyecto-2-DB/
├── docker-compose.yml
├── .env / .env.example
├── db/
│   ├── 01_schema.sql     # DDL: tablas, índices, views
│   └── 02_seed.sql       # Datos de prueba (25+ por tabla)
├── backend/              # Node.js + Express
│   └── src/
│       ├── index.js
│       ├── db/pool.js
│       ├── middleware/auth.js
│       └── routes/
│           ├── auth.js       # Login JWT
│           ├── productos.js  # CRUD + bajo stock (EXISTS)
│           ├── ventas.js     # CRUD + transacción explícita
│           ├── reportes.js   # GROUP BY, CTE, subqueries, VIEWs
│           └── entidades.js  # Clientes, Empleados, Categorías, Proveedores
└── frontend/             # React + Vite
    └── src/
        ├── context/      # AuthContext (estado global de sesión)
        ├── pages/        # Dashboard, Productos, Ventas, Clientes...
        ├── test/         # Pruebas unitarias con Vitest
        ├── api.js        # Cliente centralizado de la API REST
        └── index.css     # Estilos (responsivo: móvil y escritorio)
```

---

## Frontend — React

### Rutas (React Router)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/login` | Login | Autenticación |
| `/dashboard` | Dashboard | Resumen con gráficas (recharts) |
| `/productos` | Productos | CRUD completo |
| `/ventas` | Ventas | Listado de ventas |
| `/ventas/new` | Nueva Venta | Formulario con carrito |
| `/clientes` | Clientes | CRUD completo |
| `/empleados` | Empleados | CRUD completo |
| `/inventario` | Inventario | Productos bajo stock |
| `/reportes` | Reportes | 6 reportes con exportación CSV |

### Hooks utilizados

| Hook | Dónde | Para qué |
|------|-------|----------|
| `useState` | Todas las páginas | Estado local de formularios y datos |
| `useEffect` | Todas las páginas | Fetch de datos al montar |
| `useReducer` | NuevaVenta.jsx | Gestión del carrito (ADD, REMOVE, CLEAR) |
| `useMemo` | Productos.jsx | Memoización del filtrado de productos |
| `useCallback` | Productos.jsx | Función `load` estable entre renders |
| `useContext` | Layout + páginas | Acceso al estado global de sesión |

### Estado global (React Context)

`AuthContext` provee a toda la app: usuario autenticado, token JWT, funciones `login` / `logout` y estado de carga. El token se persiste en `localStorage`.

---

## Diseño de base de datos

### Entidades principales

| Tabla | Descripción |
|-------|-------------|
| `categorias` | Grupos de productos |
| `proveedores` | Empresas que surten productos |
| `productos` | Artículos con stock |
| `clientes` | Compradores registrados |
| `empleados` | Personal de la tienda |
| `usuarios` | Cuentas de acceso (1:1 con empleados) |
| `ventas` | Encabezado de cada venta |
| `detalle_ventas` | Líneas de cada venta |
| `compras` | Órdenes a proveedores |
| `detalle_compras` | Líneas de cada compra |

### Modelo relacional

```
categorias(id_categoria PK, nombre, descripcion, activo, creado_en)
proveedores(id_proveedor PK, nombre, contacto, telefono, email, direccion, activo, creado_en)
productos(id_producto PK, id_categoria FK, id_proveedor FK, nombre, descripcion,
          precio_compra, precio_venta, stock, stock_minimo, activo, creado_en)
empleados(id_empleado PK, nombre, apellido, email UNIQUE, telefono, cargo, salario, fecha_ingreso, activo)
usuarios(id_usuario PK, id_empleado FK UNIQUE, username UNIQUE, password_hash, rol, activo, ultimo_login)
clientes(id_cliente PK, nombre, apellido, email UNIQUE, telefono, direccion, nit UNIQUE, activo)
ventas(id_venta PK, id_cliente FK, id_empleado FK, fecha_venta, total, estado, notas)
detalle_ventas(id_detalle PK, id_venta FK, id_producto FK, cantidad, precio_unitario, subtotal)
compras(id_compra PK, id_proveedor FK, id_empleado FK, fecha_compra, total, estado)
detalle_compras(id_detalle PK, id_compra FK, id_producto FK, cantidad, precio_unitario, subtotal)
```

### Normalización hasta 3FN

**1FN:** Todas las tablas tienen PK, atributos atómicos, sin grupos repetidos.

**2FN:** En `detalle_ventas`, todos los atributos dependen de la PK compuesta `(id_venta, id_producto)` completa. Sin dependencias parciales.

**3FN:** Sin dependencias transitivas. El nombre del proveedor o categoría no se almacena en `productos`; se accede vía FK. Lo mismo para todos los demás datos derivados.
