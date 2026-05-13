# Plan de Trabajo — Fase 1.5
### Estructura de módulos · Puente hacia la Fase 2 (Frontend)
#### Parcial 1 · Programación con Tecnologías Web · V Semestre

> **Propósito de este documento:** complementa la Fase 1 (mock API). Define  la estructura interna de cada módulo, el patrón de estado con Zustand, la estrategia de geolocalización y las instrucciones para documentar el README. No incluye código de componentes visuales — eso es Fase 2.


## 2. Estructura de módulos

Cada módulo vive en `src/modules/[nombre]/` y solo incluye las capas que realmente necesita. No se crean carpetas vacías por convención.

### Regla general por capa

| Capa | Qué hace | Importa de |
|---|---|---|
| `types/` | Tipos TS públicos del módulo | Nadie (solo tipos) |
| `services/` | Llama a `core/api` — lógica de llamadas pura | `core/api`, `types/` |
| `store/` | Estado Zustand: `isLoading`, `isStale`, `error`, datos, acciones | `services/`, `types/` |
| `hooks/` | Hooks React que consumen el store y orquestan efectos | `store/` |
| `components/` | Componentes visuales reutilizables dentro del módulo | `hooks/`, `types/` |
| `screens/` | Composición de pantallas completas — solo renderizado | `hooks/`, `components/` |
| `utils/` | Parsers, mappers, transformaciones específicas del módulo | Nadie |
| `index.ts` | Re-exports públicos del módulo | Todo lo anterior |

> **Principio:** una pantalla nunca llama a un servicio directamente. Siempre pasa por hook → store → servicio → adapter.

---

### 2.1 Módulo `products`

**Responsabilidad:** catálogo de libros y detalle de un libro.

```
src/modules/products/
├── types/
│   └── index.ts          # Book, ProductFilters, ProductsState
├── services/
│   └── products.service.ts
├── store/
│   ├── products.store.ts  # lista + detalle en el mismo store
│   └── index.ts
├── hooks/
│   ├── useProducts.ts     # lista con filtros
│   └── useProductDetail.ts
├── components/
│   └── BookCard.tsx       # tarjeta de libro para el catálogo
├── screens/
│   ├── CatalogScreen.tsx
│   └── ProductDetailScreen.tsx
└── index.ts
```

**Estado del store:**
```ts
interface ProductsState {
  // Lista
  books: Book[];
  filters: ProductFilters;
  isLoading: boolean;
  isStale: boolean;
  error: string | null;

  // Detalle
  selectedBook: Book | null;
  isLoadingDetail: boolean;
  errorDetail: string | null;

  // Acciones
  fetchBooks: (filters?: ProductFilters) => Promise<void>;
  fetchBookById: (id: string) => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  markAsStale: () => void;
  reset: () => void;
}
```

---

### 2.2 Módulo `branches`

**Responsabilidad:** listar sucursales y encontrar la más cercana. Contiene la lógica de `navigator.geolocation`.

```
src/modules/branches/
├── types/
│   └── index.ts           # Branch, Coords, BranchesState
├── services/
│   └── branches.service.ts
├── store/
│   ├── branches.store.ts
│   └── index.ts
├── hooks/
│   ├── useBranches.ts         # lista completa
│   └── useNearestBranch.ts    # orquesta geolocation + llamada al mock
├── utils/
│   └── geolocation.util.ts    # wrapper de navigator.geolocation → Promise<Coords>
├── components/
│   └── BranchCard.tsx
└── index.ts
```

**Estado del store:**
```ts
interface BranchesState {
  branches: Branch[];
  nearestBranch: Branch | null;
  locationDenied: boolean;       // true cuando el usuario niega el permiso
  isLoading: boolean;
  isStale: boolean;
  error: string | null;

  // Acciones
  fetchBranches: () => Promise<void>;
  fetchNearestBranch: () => Promise<void>;  // internamente llama a geolocation.util
  markAsStale: () => void;
  reset: () => void;
}
```

**Lógica de geolocalización (`geolocation.util.ts`):**

```ts
// Devuelve las coordenadas o lanza GeolocationError tipado
export type GeolocationResult =
  | { granted: true;  coords: Coords }
  | { granted: false; reason: 'denied' | 'unavailable' | 'timeout' };

export const requestGeolocation = (): Promise<GeolocationResult> => { ... }
```

**Comportamiento en el hook `useNearestBranch`:**

```
requestGeolocation()
    │
    ├── granted: true  → llama a branches.service.getNearestBranch(coords)
    │                    → store guarda nearestBranch
    │
    └── granted: false → store pone locationDenied = true
                         → la pantalla muestra lista de sucursales para elegir manualmente
                         → el usuario selecciona una y esa queda como "sucursal elegida"
```

> La sucursal elegida (ya sea la más cercana automáticamente o la seleccionada manualmente) se pasa al módulo de `orders` como parte del payload de compra.

---

### 2.3 Módulo `orders`

**Responsabilidad:** construir y enviar el pedido, guardar el recibo resultante.

```
src/modules/orders/
├── types/
│   └── index.ts           # CreateOrderPayload, OrderReceipt, OrdersState
├── services/
│   └── orders.service.ts
├── store/
│   ├── orders.store.ts
│   └── index.ts
├── hooks/
│   └── useCreateOrder.ts
├── screens/
│   ├── OrderFormScreen.tsx   # formulario datos cliente + tipo entrega
│   └── OrderReceiptScreen.tsx
└── index.ts
```

**Estado del store:**
```ts
interface OrdersState {
  // Pedido en construcción (borrador local, no va al mock hasta confirmar)
  draft: Partial<CreateOrderPayload>;

  // Resultado
  receipt: OrderReceipt | null;
  isLoading: boolean;
  error: string | null;

  // Acciones
  setDraft: (partial: Partial<CreateOrderPayload>) => void;
  submitOrder: () => Promise<void>;   // usa get() para leer draft actual
  clearReceipt: () => void;
  reset: () => void;
}
```

> `orders` no tiene `isStale` ni `markAsStale` porque no cachea listas — solo guarda el último recibo de la sesión.

---

### 2.4 Módulo `contact`

**Responsabilidad:** enviar el formulario de contacto y mostrar confirmación.

```
src/modules/contact/
├── types/
│   └── index.ts           # ContactPayload, ContactConfirmation, ContactState
├── services/
│   └── contact.service.ts
├── hooks/
│   └── useContact.ts
├── screens/
│   └── ContactScreen.tsx
└── index.ts
```

> **Sin store de Zustand.** El módulo de contacto no necesita caché ni estado global entre navegaciones. El hook `useContact` maneja `isLoading`, `error` y `confirmation` con `useState` local — es suficiente para este caso de uso.

**Estado local en el hook:**
```ts
const useContact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ContactConfirmation | null>(null);

  const send = async (payload: ContactPayload) => { ... };

  return { isLoading, error, confirmation, send };
};
```

---

## 3. Patrón Zustand — convenciones del proyecto

### 3.1 Estructura base de un store

Todos los stores que usan Zustand siguen esta estructura mental, sin herencia ni tipo base compartido. Lo que es consistente es la **disciplina**, no el código:

```ts
// Ejemplo: products.store.ts
import { create } from 'zustand';
import { getProducts, getProductById } from '../services/products.service';
import type { ProductsState } from '../types';

// Controlador de abort para cancelar requests previos
let abortController: AbortController | null = null;

export const useProductsStore = create<ProductsState>((set, get) => ({
  // --- Estado inicial ---
  books: [],
  filters: {},
  isLoading: false,
  isStale: false,
  error: null,
  selectedBook: null,
  isLoadingDetail: false,
  errorDetail: null,

  // --- Acciones ---
  fetchBooks: async (filters) => {
    // Abortar request previo si existe
    abortController?.abort();
    abortController = new AbortController();

    set({ isLoading: true, error: null });

    const response = await getProducts(filters ?? get().filters);

    if (response.success) {
      set({ books: response.data, isLoading: false, isStale: false });
    } else {
      set({ error: response.error.message, isLoading: false });
    }
  },

  fetchBookById: async (id) => {
    set({ isLoadingDetail: true, errorDetail: null });
    const response = await getProductById(id);
    if (response.success) {
      set({ selectedBook: response.data, isLoadingDetail: false });
    } else {
      set({ errorDetail: response.error.message, isLoadingDetail: false });
    }
  },

  setFilters: (filters) => {
    set({ filters, isStale: true });
  },

  markAsStale: () => {
    set({ books: [], isStale: true });
  },

  reset: () => {
    abortController?.abort();
    set({ books: [], filters: {}, isLoading: false, isStale: false, error: null });
  },
}));
```

### 3.2 Reglas consistentes entre todos los stores

| Regla | Detalle |
|---|---|
| `isLoading` | Siempre presente en stores con fetch. Se pone `true` al inicio de la acción y `false` al final (éxito o error). |
| `isStale` | Indica que los datos están desactualizados y hay que refetch. Se activa con `markAsStale()` o `setFilters()`. |
| `error` | Siempre `string \| null`. Nunca se guarda el objeto de error completo — solo el mensaje legible. |
| `markAsStale()` | Limpia datos y marca `isStale: true`. El hook detecta `isStale` y dispara `fetch` automáticamente. |
| `AbortController` | Las acciones `fetch*` abortan el request previo antes de lanzar uno nuevo. Variable en el closure del módulo, no en el estado. |
| `get()` en acciones | Se usa `get()` de Zustand para leer estado actual dentro de acciones (ej: leer `draft` en `submitOrder`). Nunca se pasa estado como parámetro a otra acción del mismo store. |
| Sin lógica de presentación | El store no sabe nada de React ni de rutas. Solo datos y acciones. |

### 3.3 Patrón de uso en hooks

```ts
// hooks/useProducts.ts
export const useProducts = () => {
  const { books, isLoading, isStale, error, fetchBooks, setFilters } =
    useProductsStore();

  useEffect(() => {
    // Fetch inicial o cuando los datos están stale
    if (books.length === 0 || isStale) {
      fetchBooks();
    }
  }, [isStale]);

  return { books, isLoading, error, setFilters };
};
```

> Los hooks son la única puerta de entrada al store desde los componentes. Las pantallas importan hooks, no stores directamente.

---

## 4. Estrategia de geolocalización

### 4.1 Responsabilidades por capa

| Capa | Responsabilidad |
|---|---|
| `geolocation.util.ts` | Wrappea `navigator.geolocation` en una `Promise` tipada. Maneja los tres casos de error de la API del navegador. |
| `branches.store.ts` | Guarda el resultado: `nearestBranch`, `locationDenied`, `isLoading`, `error`. |
| `useNearestBranch.ts` | Orquesta: llama al util, decide qué acción del store disparar según el resultado. |
| `BranchSelectorScreen` (Fase 2) | Renderiza según el estado del store: spinner → sucursal sugerida → o lista manual si `locationDenied`. |

### 4.2 Implementación del util

```ts
// modules/branches/utils/geolocation.util.ts

export interface Coords {
  lat: number;
  lng: number;
}

export type GeolocationResult =
  | { granted: true;  coords: Coords }
  | { granted: false; reason: 'denied' | 'unavailable' | 'timeout' };

export const requestGeolocation = (): Promise<GeolocationResult> =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ granted: false, reason: 'unavailable' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        granted: true,
        coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      }),
      (err) => {
        const reason =
          err.code === err.PERMISSION_DENIED    ? 'denied'      :
          err.code === err.TIMEOUT              ? 'timeout'     : 'unavailable';
        resolve({ granted: false, reason });
      },
      { timeout: 8000, maximumAge: 60_000 }
    );
  });
```

### 4.3 Flujo en el hook

```ts
// modules/branches/hooks/useNearestBranch.ts

export const useNearestBranch = () => {
  const { nearestBranch, locationDenied, isLoading, error,
          fetchNearestBranch, fetchBranches } = useBranchesStore();

  useEffect(() => {
    fetchNearestBranch(); // el store internamente llama a requestGeolocation
  }, []);

  // Si locationDenied, el componente debe mostrar la lista manual
  return { nearestBranch, locationDenied, isLoading, error };
};
```

### 4.4 Comportamiento en pantalla (referencia para Fase 2)

```
Estado inicial     → spinner "Buscando tu sucursal más cercana..."
locationDenied     → lista de todas las sucursales (ciudad + nombre) para elección manual
nearestBranch      → card con la sucursal sugerida + botón "Cambiar sucursal"
                     (al pulsar "Cambiar" muestra la lista completa)
error de red       → mensaje de error con botón "Reintentar"
```

---

## 5. Instrucciones para el README

El README es un documento técnico dirigido al docente. Debe ser claro, directo y completo. A continuación la plantilla y las instrucciones de qué incluir en cada sección.

### 5.1 Estructura del README

```markdown
# Letras del Eje

Breve descripción del proyecto (2–3 líneas): qué es, para qué sirve, qué tecnologías usa.

## Cómo correr el proyecto localmente

Prerrequisitos: Node.js 20+, npm 10+

\`\`\`bash
git clone https://github.com/[usuario]/letras-del-eje.git
cd letras-del-eje
npm install
npm run dev
\`\`\`

La aplicación queda disponible en `http://localhost:5173`.

Por defecto corre con el mock activado (`VITE_USE_MOCK=true` en `.env`).
No requiere backend ni conexión a internet para funcionar.

## Tecnologías utilizadas

- React 19 + Vite
- TypeScript estricto
- Zustand (estado global)
- CSS Modules / [lo que se use]

## Documentación de endpoints simulados (mockApi)

[ver sección 5.2]
```

### 5.2 Formato de documentación de cada endpoint

Cada endpoint debe documentarse con este bloque. Usar una sección `###` por endpoint.

```markdown
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
\`\`\`json
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
      "description": "...",
      "isbn": "978-0-06-088328-7"
    }
  ]
}
\`\`\`

**Respuesta de error — `500 Internal Server Error` (simulado, probabilidad 10%):**
\`\`\`json
{
  "success": false,
  "status": 500,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Error inesperado del servidor. Intenta de nuevo."
  }
}
\`\`\`

**Latencia simulada:** 500–1200 ms
```

> Replicar este bloque para los 6 endpoints. Incluir **todos** los códigos de error posibles por endpoint, no solo el 500.

### 5.3 Checklist del README antes de entregar

- [ ] Descripción del proyecto (qué es y qué tecnologías usa)
- [ ] Instrucciones de instalación y ejecución local
- [ ] Sección de endpoints con los 6 documentados
- [ ] Cada endpoint tiene: equivalente HTTP, parámetros, ejemplo de respuesta exitosa, ejemplo(s) de error
- [ ] El README está en la raíz del repositorio (`/README.md`)
- [ ] El repositorio es público y el README se ve correctamente en GitHub

---

## 6. Resumen de módulos y sus capas

| Módulo | types | services | store | hooks | components | screens | utils |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `products` | ✅ | ✅ | ✅ | ✅ | ✅ `BookCard` | ✅ Catálogo + Detalle | ✗ |
| `branches` | ✅ | ✅ | ✅ | ✅ | ✅ `BranchCard` | ✅ Selector | ✅ `geolocation.util` |
| `orders` | ✅ | ✅ | ✅ | ✅ | ✗ | ✅ Formulario + Recibo | ✗ |
| `contact` | ✅ | ✅ | ✗ | ✅ (useState) | ✗ | ✅ Contacto | ✗ |

---

## 7. Lo que esta fase NO cubre (queda para Fase 2 — Frontend)

- Implementación visual de pantallas y componentes
- Sistema de rutas (React Router o similar)
- Estilos, responsividad, media queries
- Integración real de `navigator.geolocation` en el componente (el util ya está definido)
- Visualización del recibo en pantalla
- Manejo de formularios (React Hook Form o controlado manual)
- Capturas de pantalla para el README

---

*Documento de planificación — actualizar a medida que avanza la implementación.*
