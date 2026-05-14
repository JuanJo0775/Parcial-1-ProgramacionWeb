# Letras del Eje 

**Página web de librería con sucursales en el Eje Cafetero colombiano (Caldas, Risaralda, Quindío)**

Parcial 1 — Programación con Tecnologías Web · V Semestre

---

## Descripción del Proyecto

Letras del Eje es una aplicación web que permite a los usuarios:
- Explorar un catálogo de libros disponibles con filtros
- Ver detalles de cada libro
- Hacer pedidos con entrega a domicilio o retiro en sucursal
- Encontrar la sucursal más cercana usando geolocalización
- Enviar mensajes de contacto

**Características técnicas:**
- Mock API completamente funcional (sin backend real)
- Tipado estricto en TypeScript
- Gestión de estado global con Zustand
- Estructura modular escalable

---

## Inicio Rápido

### Requisitos
- Node.js 20+ 
- npm 10+
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/JuanJo0775/Parcial-1-ProgramacionWeb.git
cd Parcial-1-ProgramacionWeb
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4. Compilar para producción
```bash
npm run build
```

---

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|---|---|---|
| **React** | 19.2.6 | Framework UI |
| **TypeScript** | 6.0.2 | Tipado estricto |
| **Vite** | 8.0.12 | Build tool y dev server |
| **Zustand** | 5.0.13 | Gestión de estado global |
| **ESLint** | 10.3.0 | Linting de código |

---

## Documentación de endpoints simulados (mockApi)

### `getProducts(filters?)`

**Equivalente HTTP:** `GET /api/v1/products`

**Descripción:** Retorna el catálogo completo de libros. Acepta filtros opcionales.

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `filters.genre` | `string` | No | Filtra por género literario |
| `filters.priceMax` | `number` | No | Precio máximo en COP |
| `filters.available` | `boolean` | No | Si `true`, solo libros con stock > 0 |

**Respuesta exitosa — `200 OK`:**

```json
{
    "success": true,
    "status": 200,
    "data": [
        {
            "id": "book-001",
            "title": "Cien años de soledad",
            "author": "Gabriel García Márquez",
            "genre": "Novela",
            "price": 45000,
            "stock": 8,
            "coverUrl": "/assets/covers/cien-anos.jpg",
            "description": "La saga de la familia Buendía a lo largo de siete generaciones...",
            "isbn": "978-0-06-088328-7"
        }
    ]
}
```

**Respuesta de error — `500 Internal Server Error` (simulado, probabilidad 10%):**

```json
{
    "success": false,
    "status": 500,
    "error": {
        "code": "INTERNAL_SERVER_ERROR",
        "message": "Error inesperado del servidor. Intenta de nuevo."
    }
}
```

**Latencia simulada:** 500–1200 ms

---

### `getProductById(id)`

**Equivalente HTTP:** `GET /api/v1/products/:id`

**Descripción:** Detalle de un libro específico por ID.

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `string` | Sí | Identificador único del libro |

**Respuesta exitosa — `200 OK`:**

```json
{
    "success": true,
    "status": 200,
    "data": {
        "id": "book-001",
        "title": "Cien años de soledad",
        "author": "Gabriel García Márquez",
        "genre": "Novela",
        "price": 45000,
        "stock": 8,
        "coverUrl": "/assets/covers/cien-anos.jpg",
        "description": "La saga de la familia Buendía...",
        "isbn": "978-0-06-088328-7"
    }
}
```

**Respuesta de error — `404 Not Found`:**

```json
{
    "success": false,
    "status": 404,
    "error": {
        "code": "NOT_FOUND",
        "message": "Libro con id \"book-999\" no encontrado."
    }
}
```

**Respuesta de error — `500 Internal Server Error`:**

```json
{
    "success": false,
    "status": 500,
    "error": {
        "code": "INTERNAL_SERVER_ERROR",
        "message": "Error inesperado del servidor. Intenta de nuevo."
    }
}
```

**Latencia simulada:** 500–1200 ms

---

### `getBranches()`

**Equivalente HTTP:** `GET /api/v1/branches`

**Descripción:** Lista todas las sucursales con coordenadas y ciudad.

**Parámetros:** Ninguno.

**Respuesta exitosa — `200 OK`:**

```json
{
    "success": true,
    "status": 200,
    "data": [
        {
            "id": "branch-001",
            "name": "Letras del Eje — Manizales Centro",
            "city": "Manizales",
            "department": "Caldas",
            "address": "Carrera 23 # 21-58, Centro",
            "phone": "(606) 884-1234",
            "lat": 5.0671,
            "lng": -75.5177,
            "openHours": "Lun–Sáb 9:00–19:00"
        }
    ]
}
```

**Respuesta de error — `500 Internal Server Error`:**

```json
{
    "success": false,
    "status": 500,
    "error": {
        "code": "INTERNAL_SERVER_ERROR",
        "message": "Error inesperado del servidor. Intenta de nuevo."
    }
}
```

**Latencia simulada:** 500–1200 ms

---

### `getNearestBranch(coords)`

**Equivalente HTTP:** `POST /api/v1/branches/nearest`

**Descripción:** Recibe `{ lat, lng }` del navegador y devuelve la sucursal más cercana usando la fórmula Haversine.

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `coords.lat` | `number` | Sí | Latitud (-90 a 90) |
| `coords.lng` | `number` | Sí | Longitud (-180 a 180) |

**Respuesta exitosa — `200 OK`:**

```json
{
    "success": true,
    "status": 200,
    "data": {
        "id": "branch-003",
        "name": "Letras del Eje — Pereira Circunvalar",
        "city": "Pereira",
        "department": "Risaralda",
        "address": "Av. Circunvalar # 5-32",
        "phone": "(606) 335-9012",
        "lat": 4.8133,
        "lng": -75.6901,
        "openHours": "Lun–Sáb 9:00–19:00"
    }
}
```

**Respuesta de error — `404 Not Found` (sin sucursales):**

```json
{
    "success": false,
    "status": 404,
    "error": {
        "code": "NOT_FOUND",
        "message": "No hay sucursales disponibles."
    }
}
```

**Respuesta de error — `400 Bad Request`:**

```json
{
    "success": false,
    "status": 400,
    "error": {
        "code": "BAD_REQUEST",
        "message": "Coordenadas fuera de rango válido."
    }
}
```

**Respuesta de error — `500 Internal Server Error`:**

```json
{
    "success": false,
    "status": 500,
    "error": {
        "code": "INTERNAL_SERVER_ERROR",
        "message": "Error inesperado del servidor. Intenta de nuevo."
    }
}
```

**Latencia simulada:** 500–1200 ms

---

### `createOrder(payload)`

**Equivalente HTTP:** `POST /api/v1/orders`

**Descripción:** Registra un pedido y devuelve un recibo con número de orden.

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `customer.fullName` | `string` | Sí | Nombre completo del cliente |
| `customer.email` | `string` | Sí | Correo electrónico |
| `customer.phone` | `string` | Sí | Teléfono de contacto |
| `items` | `Array<{bookId, quantity}>` | Sí | Al menos 1 ítem; cantidad mínima 1 |
| `delivery.type` | `'pickup'` \| `'home_delivery'` | Sí | Tipo de entrega |
| `delivery.branchId` | `string` | Sí | Sucursal de origen/entrega |
| `delivery.address` | `string` | Sí (si `home_delivery`) | Dirección de entrega |
| `delivery.city` | `string` | Sí (si `home_delivery`) | Ciudad de entrega |

**Respuesta exitosa — `201 Created`:**

```json
{
    "success": true,
    "status": 201,
    "data": {
        "orderId": "ORD-20250513-0042",
        "status": "confirmed",
        "createdAt": "2025-05-13T14:23:00.000Z",
        "customer": {
            "fullName": "Juan Pérez",
            "email": "juan@example.com",
            "phone": "3001234567"
        },
        "items": [
            {
                "bookId": "book-001",
                "title": "Cien años de soledad",
                "quantity": 2,
                "unitPrice": 45000,
                "subtotal": 90000
            }
        ],
        "delivery": {
            "type": "home_delivery",
            "branchId": "branch-003",
            "address": "Calle 10 # 5-20",
            "city": "Pereira"
        },
        "totals": {
            "subtotal": 90000,
            "deliveryFee": 8000,
            "total": 98000
        },
        "paymentMethod": "cash_on_delivery",
        "instructions": "Paga al recibir tu pedido en la dirección indicada."
    }
}
```

**Respuesta de error — `400 Bad Request`:**

```json
{
    "success": false,
    "status": 400,
    "error": {
        "code": "BAD_REQUEST",
        "message": "Faltan datos del cliente: nombre, email o teléfono."
    }
}
```

**Respuesta de error — `409 Conflict` (stock insuficiente):**

```json
{
    "success": false,
    "status": 409,
    "error": {
        "code": "INSUFFICIENT_STOCK",
        "message": "Stock insuficiente para \"Cien años de soledad\"."
    }
}
```

**Respuesta de error — `500 Internal Server Error`:**

```json
{
    "success": false,
    "status": 500,
    "error": {
        "code": "INTERNAL_SERVER_ERROR",
        "message": "Error inesperado del servidor. Intenta de nuevo."
    }
}
```

**Latencia simulada:** 500–1200 ms

---

### `sendContactMessage(payload)`

**Equivalente HTTP:** `POST /api/v1/contact`

**Descripción:** Registra un mensaje de contacto. Máximo 3 envíos por sesión.

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `fullName` | `string` | Sí | Nombre completo |
| `email` | `string` | Sí | Email válido |
| `subject` | `string` | Sí | Asunto del mensaje |
| `message` | `string` | Sí | Mensaje (mínimo 10 caracteres) |

**Respuesta exitosa — `201 Created`:**

```json
{
    "success": true,
    "status": 201,
    "data": {
        "ticketId": "TKT-20250513-0017",
        "message": "Tu mensaje fue recibido. Te contactaremos en menos de 24 horas."
    }
}
```

**Respuesta de error — `400 Bad Request`:**

```json
{
    "success": false,
    "status": 400,
    "error": {
        "code": "BAD_REQUEST",
        "message": "Todos los campos son requeridos."
    }
}
```

**Respuesta de error — `422 Unprocessable Entity`:**

```json
{
    "success": false,
    "status": 422,
    "error": {
        "code": "MESSAGE_TOO_SHORT",
        "message": "El mensaje debe tener al menos 10 caracteres."
    }
}
```

**Respuesta de error — `429 Too Many Requests`:**

```json
{
    "success": false,
    "status": 429,
    "error": {
        "code": "TOO_MANY_REQUESTS",
        "message": "Has excedido el límite de 3 mensajes por sesión."
    }
}
```

**Respuesta de error — `500 Internal Server Error`:**

```json
{
    "success": false,
    "status": 500,
    "error": {
        "code": "INTERNAL_SERVER_ERROR",
        "message": "Error inesperado del servidor. Intenta de nuevo."
    }
}
```

**Latencia simulada:** 500–1200 ms

---

## Tabla resumen de endpoints

| Función | Equiv. HTTP | Parámetros | Éxito | Error principal |
|---|---|---|---|---|
| `getProducts(filters?)` | `GET /api/v1/products` | `filters: { genre?, priceMax?, available? }` | `200` — `Book[]` | `500` |
| `getProductById(id)` | `GET /api/v1/products/:id` | `id: string` | `200` — `Book` | `404`, `500` |
| `getBranches()` | `GET /api/v1/branches` | — | `200` — `Branch[]` | `500` |
| `getNearestBranch(coords)` | `POST /api/v1/branches/nearest` | `{ lat: number, lng: number }` | `200` — `Branch` | `404`, `400`, `500` |
| `createOrder(payload)` | `POST /api/v1/orders` | `CreateOrderPayload` | `201` — `OrderReceipt` | `400`, `409`, `500` |
| `sendContactMessage(payload)` | `POST /api/v1/contact` | `ContactPayload` | `201` — `ContactConfirmation` | `400`, `422`, `429`, `500` |

---

## Estructura del Proyecto

```
src/
├── core/
│   └── api/
│       ├── adapter/              # Implementación del adaptador de API
│       └── types/                # Tipos genéricos de API
│
├── mock/                         # Simulación del backend
│   ├── data/                     # Datos semilla (libros, sucursales)
│   ├── handlers/                 # Lógica de cada dominio (products, branches, etc)
│   └── utils/                    # Utilidades (delay, Haversine, etc)
│
├── modules/                      # Módulos de negocio
│   ├── products/                 # Catálogo de libros
│   ├── branches/                 # Sucursales y geolocalización
│   ├── orders/                   # Gestión de pedidos
│   └── contact/                  # Formulario de contacto
│
└── shared/                       # Recursos compartidos
    └── types/                    # Tipos globales reutilizables
```

**Cada módulo tiene esta estructura interna:**
- `types/` — Interfaces y tipos del módulo
- `services/` — Lógica de llamadas a API
- `store/` — Estado global con Zustand
- `hooks/` — Custom hooks para componentes
- `components/` — Componentes reutilizables
- `screens/` — Pantallas completas

---

---

## Comandos

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Ejecutar en desarrollo
npm run dev
# → La app queda disponible en http://localhost:5173

# Compilar para producción
npm run build
# → Genera archivos optimizados en /dist

# Previsualizar la build de producción
npm run preview

# Verificar código con ESLint
npm run lint
# → 0 errores esperados (4 advertencias de useEffect deps son intencionales)
```

---

## Arquitectura

### Flujo de datos (regla del proyecto)

```
Componente / Screen
    ↓
use[ModuleName]()          ← hook (única puerta de entrada al store)
    ↓
useStore de Zustand        ← estado global
    ↓
service.ts                ← llama al adapter
    ↓
adapter (mock / real)     ← implementa IApiAdapter
    ↓
handler del mock          ← delay + errores simulados + lógica de dominio
    ↓
datos semilla             ← books.data.ts / branches.data.ts
```

> Un componente **nunca** llama a un servicio directamente. Siempre: hook → store → servicio → adapter.

### Patrón Zustand — convenciones aplicadas

| Regla | Cómo se implementa |
|---|---|
| `isLoading` → `true` al iniciar | `set({ isLoading: true, error: null })` al inicio de cada acción `fetch*` |
| `isLoading` → `false` al terminar |不论成功或失败都设为 `false` |
| `error: string \| null` | Solo el mensaje legible se guarda en estado |
| `isStale` + `markAsStale()` | products y branches limpian datos al marcar stale; el hook detecta y refetch |
| `AbortController` | Variable en el closure del módulo, no en el estado. Aborta request previo en cada `fetch*` |
| `get()` dentro de acciones | `submitOrder` lee `get().draft`; `fetchBooks` lee `get().filters` |
| Sin lógica de presentación | Los stores solo contienen datos y acciones, cero imports de React |

### Estrategia de geolocalización

```
navigator.geolocation
    ↓
geolocation.util.ts
  └─ requestGeolocation() → Promise<GeolocationResult>
       ├─ granted: true  → { lat, lng }
       └─ granted: false → reason: 'denied' | 'unavailable' | 'timeout'

branches.store.ts
  └─ fetchNearestBranch()
       ├─ Llama a requestGeolocation()
       ├─ granted: true  → llama a getNearestBranch(coords) → guarda nearestBranch + selectedBranch
       └─ granted: false → set({ locationDenied: true })

useNearestBranch.ts
  └─ Hook que consume el store y delega la lógica al store
     Retorna: { nearestBranch, locationDenied, isLoading, error }
```

---

## Configuración

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con la siguiente variable:

```
VITE_USE_MOCK=true
```

| Variable | Valor | Descripción |
|---|---|---|
| `VITE_USE_MOCK` | `true` (por defecto) | Activa la Mock API simulada. La aplicación funciona **completamente sin backend** ni conexión a internet. Cambiar a `false` solo cuando se implemente un backend real. |

Para crear el archivo:

```bash
# En la raíz del proyecto
echo "VITE_USE_MOCK=true" > .env
```

> Sin este archivo, Vite usa valores por defecto vacíos y la mock API sigue funcionando con su configuración interna.

### TypeScript Strict Mode

- `"strict": true`
- `"noUncheckedIndexedAccess": true`

Todos los errores de TypeScript deben resolverse antes de commitear.

---

---

## Estructura de módulos

| Módulo | types | services | store | hooks | components | screens | utils |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `products` | ✅ | ✅ | ✅ | ✅ | ✅ `BookCard` | ✅ Catálogo + Detalle | ✗ |
| `branches` | ✅ | ✅ | ✅ | ✅ | ✅ `BranchCard` | ✅ Selector | ✅ `geolocation.util` |
| `orders` | ✅ | ✅ | ✅ | ✅ | ✗ | ✅ Formulario + Recibo | ✗ |
| `contact` | ✅ | ✅ | ✗ (useState) | ✅ | ✗ | ✅ Contacto | ✗ |

---

## Notas Importantes

- **No modificar** `package-lock.json` manualmente. npm lo genera automáticamente.
- **Antes de hacer commits:** ejecuta `npm lint` para revisar el código
- **Mock API:** simula latencia (500-1200ms) y errores (10% de probabilidad) para ser realista
- **TypeScript Strict:** el compilador es estricto intencionalmente. Resolver todos los errores es obligatorio.

---

**Última actualización:** 13 de mayo de 2026