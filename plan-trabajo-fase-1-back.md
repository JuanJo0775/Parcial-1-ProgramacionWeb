# Plan de Trabajo — Fase Back (Mock API)
### Parcial 1 · Programación con Tecnologías Web · V Semestre

> **Alcance de este documento:** cubre únicamente la capa de datos simulada y su arquitectura. La fase de interfaz (componentes React, rutas, estilos) es un documento aparte.

---

## 1. Decisiones técnicas base

| Decisión | Elección | Justificación |
|---|---|---|
| Lenguaje | TypeScript estricto (`"strict": true`) | Tipado en tiempo de compilación, detecta errores antes de correr |
| Framework frontend | React + Vite | Ecosistema maduro, HMR rápido, compatible con TS estricto sin config extra |
| Módulo de mock | Adaptador propio (patrón del proyecto anterior, simplificado) | Sin dependencias externas de mock, portable, fácil de entender por el docente |
| Comunicación interna | Funciones `async` que devuelven `Promise` tipadas | Imita el contrato de una llamada HTTP real sin necesitar Axios ni fetch |
| Variable de entorno | `VITE_USE_MOCK=true` (siempre `true` en este parcial) | Deja la puerta abierta al adaptador real sin modificar el código de negocio |
| Versionamiento de API | Prefijo `/api/v1/` en todos los nombres de endpoint documentados | Buena práctica; el mock lo respeta en nomenclatura aunque no use HTTP real |

---

## 2. Nombre del proyecto (ficticio)

**Página:** *Letras del Eje* — Librería con sucursales en el Eje Cafetero  
**Departamentos cubiertos:** Caldas, Risaralda, Quindío

---

## 3. Dominios de datos y endpoints simulados

El mock cubre **4 dominios**. Cada dominio tiene su propio archivo de handlers y sus propios datos. Los nombres de función siguen la convención `verboRecurso` y el equivalente HTTP se documenta junto a ellos.

### 3.1 Dominio: Productos (`/api/v1/products`)

| Función mock | Equiv. HTTP | Descripción |
|---|---|---|
| `getProducts(filters?)` | `GET /api/v1/products` | Lista todos los libros. Acepta filtros opcionales: `genre`, `priceMax`, `available` |
| `getProductById(id)` | `GET /api/v1/products/:id` | Detalle de un libro específico |

**Datos que devuelve un producto:**
```ts
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;        // COP
  stock: number;
  coverUrl: string;     // ruta local /assets/...
  description: string;
  isbn: string;
}
```

**Códigos HTTP simulados:**
- `200 OK` — lista o detalle encontrado
- `404 Not Found` — `getProductById` con id inexistente
- `500 Internal Server Error` — fallo aleatorio simulado (ver sección de latencia)

---

### 3.2 Dominio: Sucursales (`/api/v1/branches`)

| Función mock | Equiv. HTTP | Descripción |
|---|---|---|
| `getBranches()` | `GET /api/v1/branches` | Lista todas las sucursales con coordenadas y ciudad |
| `getNearestBranch(coords)` | `POST /api/v1/branches/nearest` | Recibe `{ lat, lng }` del navegador y devuelve la sucursal más cercana (cálculo con fórmula Haversine en el mock) |

> **Nota de implementación:** `navigator.geolocation` corre en el componente React. Las coordenadas se pasan al mock como parámetro. El cálculo de distancia vive en un util del mock (`haversine.util.ts`), no en el componente. Esto mantiene la lógica de negocio fuera de la vista.

**Datos que devuelve una sucursal:**
```ts
interface Branch {
  id: string;
  name: string;
  city: string;
  department: 'Caldas' | 'Risaralda' | 'Quindío';
  address: string;
  phone: string;
  lat: number;
  lng: number;
  openHours: string;  // ej. "Lun–Sáb 9:00–19:00"
}
```

**Sucursales ficticias (datos semilla — 6 sucursales):**

| Nombre | Ciudad | Dpto |
|---|---|---|
| Letras del Eje — Manizales Centro | Manizales | Caldas |
| Letras del Eje — La Enea | Manizales | Caldas |
| Letras del Eje — Pereira Circunvalar | Pereira | Risaralda |
| Letras del Eje — Dosquebradas | Dosquebradas | Risaralda |
| Letras del Eje — Armenia Centro | Armenia | Quindío |
| Letras del Eje — Montenegro | Montenegro | Quindío |

**Códigos HTTP simulados:**
- `200 OK` — lista o sucursal más cercana encontrada
- `400 Bad Request` — coordenadas faltantes o fuera de rango en `getNearestBranch`
- `500 Internal Server Error` — fallo aleatorio simulado

---

### 3.3 Dominio: Pedidos (`/api/v1/orders`)

| Función mock | Equiv. HTTP | Descripción |
|---|---|---|
| `createOrder(payload)` | `POST /api/v1/orders` | Registra un pedido y devuelve un recibo con número de orden |

**Payload que recibe:**
```ts
interface CreateOrderPayload {
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    bookId: string;
    quantity: number;
  }>;
  delivery: {
    type: 'pickup' | 'home_delivery';
    branchId: string;           // siempre requerido (pickup = va a buscarlos; home_delivery = sale desde ahí)
    address?: string;           // requerido si type === 'home_delivery'
    city?: string;              // requerido si type === 'home_delivery'
  };
}
```

**Respuesta exitosa (recibo):**
```ts
interface OrderReceipt {
  orderId: string;              // ej. "ORD-20250513-0042"
  status: 'confirmed';
  createdAt: string;            // ISO 8601
  customer: CreateOrderPayload['customer'];
  items: Array<{
    bookId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  delivery: CreateOrderPayload['delivery'];
  totals: {
    subtotal: number;
    deliveryFee: number;        // 0 si pickup, valor fijo simulado si home_delivery
    total: number;
  };
  paymentMethod: 'cash_on_delivery';
  instructions: string;        // mensaje con instrucciones de pago contra entrega
}
```

**Códigos HTTP simulados:**
- `201 Created` — pedido creado, devuelve recibo
- `400 Bad Request` — campos faltantes o `quantity < 1`
- `409 Conflict` — stock insuficiente para algún ítem
- `500 Internal Server Error` — fallo aleatorio simulado

---

### 3.4 Dominio: Contacto (`/api/v1/contact`)

| Función mock | Equiv. HTTP | Descripción |
|---|---|---|
| `sendContactMessage(payload)` | `POST /api/v1/contact` | Registra un mensaje de contacto y confirma recepción |

**Payload:**
```ts
interface ContactPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}
```

**Respuesta exitosa:**
```ts
interface ContactConfirmation {
  ticketId: string;    // ej. "TKT-20250513-0017"
  message: string;     // "Tu mensaje fue recibido. Te contactaremos en menos de 24 horas."
}
```

**Códigos HTTP simulados:**
- `201 Created` — mensaje recibido
- `400 Bad Request` — campos vacíos o email inválido
- `422 Unprocessable Entity` — mensaje demasiado corto (< 10 caracteres)
- `429 Too Many Requests` — más de 3 envíos en la misma sesión (simulado con contador en memoria)
- `500 Internal Server Error` — fallo aleatorio simulado

---

## 4. Estructura de archivos propuesta

```
src/
├── core/
│   └── api/
│       ├── adapter/
│       │   ├── IApiAdapter.ts           # Contrato (interfaz) que todos los adapters implementan
│       │   └── mock.adapter.ts          # Implementación mock — único adapter en este parcial
│       ├── index.ts                     # Resuelve qué adapter usar según VITE_USE_MOCK
│       └── types/
│           └── api-response.types.ts    # ApiResponse<T>, ApiError — envoltura genérica
│
├── mock/
│   ├── data/
│   │   ├── books.data.ts               # Array de Book[] (≥ 10 libros ficticios)
│   │   └── branches.data.ts            # Array de Branch[] (6 sucursales)
│   ├── handlers/
│   │   ├── products.handler.ts         # getProducts, getProductById
│   │   ├── branches.handler.ts         # getBranches, getNearestBranch
│   │   ├── orders.handler.ts           # createOrder
│   │   └── contact.handler.ts          # sendContactMessage
│   └── utils/
│       ├── delay.util.ts               # sleep(ms) — simula latencia de red
│       ├── mock-response.util.ts       # Helpers: mockSuccess(), mockError()
│       └── haversine.util.ts           # Cálculo de distancia entre coordenadas
│
├── modules/
│   ├── products/
│   │   ├── products.service.ts         # Llama a IApiAdapter — no sabe si es mock o real
│   │   └── products.types.ts
│   ├── branches/
│   │   ├── branches.service.ts
│   │   └── branches.types.ts
│   ├── orders/
│   │   ├── orders.service.ts
│   │   └── orders.types.ts
│   └── contact/
│       ├── contact.service.ts
│       └── contact.types.ts
│
└── shared/
    └── types/
        └── index.ts                    # Re-exports de tipos compartidos
```

---

## 5. Contrato del adaptador

```ts
// core/api/adapter/IApiAdapter.ts

import type { ApiResponse } from '../types/api-response.types';
import type {
  Book, Branch, CreateOrderPayload,
  OrderReceipt, ContactPayload, ContactConfirmation
} from '../../shared/types';

export interface IApiAdapter {
  // Products
  getProducts(filters?: ProductFilters): Promise<ApiResponse<Book[]>>;
  getProductById(id: string): Promise<ApiResponse<Book>>;

  // Branches
  getBranches(): Promise<ApiResponse<Branch[]>>;
  getNearestBranch(coords: { lat: number; lng: number }): Promise<ApiResponse<Branch>>;

  // Orders
  createOrder(payload: CreateOrderPayload): Promise<ApiResponse<OrderReceipt>>;

  // Contact
  sendContactMessage(payload: ContactPayload): Promise<ApiResponse<ContactConfirmation>>;
}
```

```ts
// core/api/types/api-response.types.ts

export type ApiResponse<T> =
  | { success: true;  status: number; data: T }
  | { success: false; status: number; error: { code: string; message: string } };
```

---

## 6. Comportamiento de latencia y errores

Todas las funciones del mock deben:

1. **Esperar un delay aleatorio** entre 500 ms y 1200 ms antes de resolver (usando `delay.util.ts`).
2. **Simular errores 500** con una probabilidad del 10 % por llamada (configurable con constante `MOCK_ERROR_RATE`).
3. Cuando el error 500 se dispara, hacer `console.error('500 Internal Server Error – [nombre del endpoint]')` tal como pide el enunciado.
4. Devolver siempre `ApiResponse<T>`, nunca lanzar excepciones directas — el frontend maneja `success: false`.

```ts
// mock/utils/delay.util.ts
export const delay = (min = 500, max = 1200): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

// mock/utils/mock-response.util.ts
export const mockSuccess = <T>(data: T, status = 200): ApiResponse<T> =>
  ({ success: true, status, data });

export const mockError = (status: number, code: string, message: string): ApiResponse<never> =>
  ({ success: false, status, error: { code, message } });
```

---

## 7. Fases de trabajo (orden de ejecución)

### Fase 1 — Setup del proyecto
- [ ] Crear proyecto con `npm create vite@latest letras-del-eje -- --template react-ts`
- [ ] Configurar `tsconfig.json` con `"strict": true`, `"noUncheckedIndexedAccess": true`
- [ ] Agregar variable de entorno `VITE_USE_MOCK=true` en `.env`
- [ ] Crear estructura de carpetas según sección 4
- [ ] Inicializar repositorio GitHub público y hacer primer commit

### Fase 2 — Tipos y contrato
- [ ] Definir todos los tipos en `shared/types/index.ts`
- [ ] Crear `ApiResponse<T>` en `core/api/types/`
- [ ] Crear interfaz `IApiAdapter` en `core/api/adapter/`

### Fase 3 — Datos semilla
- [ ] Poblar `books.data.ts` con ≥ 10 libros (variedad de géneros, precios en COP)
- [ ] Poblar `branches.data.ts` con las 6 sucursales y coordenadas reales de cada ciudad

### Fase 4 — Utils del mock
- [ ] Implementar `delay.util.ts`
- [ ] Implementar `mock-response.util.ts`
- [ ] Implementar `haversine.util.ts` (fórmula de distancia entre dos puntos GPS)

### Fase 5 — Handlers (un handler a la vez, en este orden)
- [ ] `products.handler.ts` — `getProducts` + `getProductById`
- [ ] `branches.handler.ts` — `getBranches` + `getNearestBranch`
- [ ] `orders.handler.ts` — `createOrder` con validación de stock y generación de recibo
- [ ] `contact.handler.ts` — `sendContactMessage` con contador de sesión y rate limit simulado

### Fase 6 — Adaptador y resolución
- [ ] Implementar `mock.adapter.ts` que une todos los handlers bajo `IApiAdapter`
- [ ] Implementar `core/api/index.ts` que exporta la instancia correcta según `VITE_USE_MOCK`

### Fase 7 — Servicios por módulo
- [ ] `products.service.ts`
- [ ] `branches.service.ts`
- [ ] `orders.service.ts`
- [ ] `contact.service.ts`

> Los servicios son la única capa que el frontend (componentes React) importará. Nunca importar el adapter directamente desde un componente.

### Fase 8 — Documentación
- [ ] Escribir `README.md` con: descripción, cómo correr localmente, tabla de endpoints documentados
- [ ] Verificar que el repositorio es público y accesible

---

## 8. Tabla resumen de endpoints para el README

| Función | Equiv. HTTP | Parámetros | Éxito | Error principal |
|---|---|---|---|---|
| `getProducts(filters?)` | `GET /api/v1/products` | `filters: { genre?, priceMax?, available? }` | `200` — `Book[]` | `500` |
| `getProductById(id)` | `GET /api/v1/products/:id` | `id: string` | `200` — `Book` | `404`, `500` |
| `getBranches()` | `GET /api/v1/branches` | — | `200` — `Branch[]` | `500` |
| `getNearestBranch(coords)` | `POST /api/v1/branches/nearest` | `{ lat: number, lng: number }` | `200` — `Branch` | `400`, `500` |
| `createOrder(payload)` | `POST /api/v1/orders` | `CreateOrderPayload` | `201` — `OrderReceipt` | `400`, `409`, `500` |
| `sendContactMessage(payload)` | `POST /api/v1/contact` | `ContactPayload` | `201` — `ContactConfirmation` | `400`, `422`, `429`, `500` |

---

## 9. Lo que esta fase NO cubre (queda para fase frontend)

- Componentes React (landing, catálogo, detalle, formularios)
- Manejo de estado global (Context o Zustand)
- Estilos, responsividad, media queries
- Lógica de `navigator.geolocation` (el componente la llama y pasa las coords al servicio)
- Visualización del recibo de pedido
- README sección "cómo se ve" (capturas de pantalla)

---

*Documento generado como guía de trabajo. Actualizar checkboxes conforme se avance.*
