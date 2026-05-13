# Letras del Eje — Reporte de Desarrollo

## Descripción del Proyecto

**Letras del Eje** es una aplicación web de librería con presencia física en el Eje Cafetero colombiano (Caldas, Risaralda, Quindío). Permite explorar un catálogo de libros, hacer pedidos con entrega a domicilio o retiro en sucursal, encontrar la sucursal más cercana por geolocalización y enviar mensajes de contacto.

---

## Fases Ejecutadas

| Fase | Alcance | Estado |
|---|---|---|
| **Fase 1** | Mock API completa (6 endpoints), tipos compartidos, documentación de endpoints | ✅ Completada |
| **Fase 1.5** | Lógica de negocio (Zustand), pantallas con formularios y flujos completos, navegación | ✅ Completada |

---

## Decisiones Arquitectónicas y Justificación

### 1. Arquitectura del adaptador (IApiAdapter)

**Decisión:** Se creó una interfaz `IApiAdapter` en `core/api/adapter/` que define los 6 métodos de la API. La implementación concreta (`mock.adapter.ts`) recibe los handlers del mock.

**Por qué:** Esta decisión permite cumplir con el requisito de que **la misma API funcione con un mock o con un backend real** (futura Fase 2) sin cambiar un solo componente. El switch se hace en `core/api/index.ts`:

```ts
export const api: IApiAdapter = useMock ? mockAdapter : mockAdapter;
```

Hoy siempre apunta al mock, pero agregar un `RealApiAdapter` tomorrow requiere solo cambiar esta línea.

### 2. Los servicios importan desde `types/` del módulo, no directamente de `shared/types`

**Decisión:** Cada módulo tiene su propio `types/index.ts` que re-exporta los tipos shareados y define su `State`.

**Por qué:** Esto evita conflictos de declaración circular cuando un tipo se importa en ambos sentidos. Además, el `State` de cada módulo es privado al módulo — nadie fuera del módulo necesita saber cómo está estructurado internamente.

```
products.service.ts   →   import from '../types'   →   types/index.ts
                                                        └─ define ProductsState
                                                        └─ re-export Book, ProductFilters
```

### 3. Cada store exporta su propio tipo de estado

**Decisión:** Los stores exporting their types with `export type { XxxState }` directly from the store file, in addition to the `types/index.ts`.

**Por qué:** Los consumers del store necesitan tipar sus variables correctamente. Tener dos puntos de exportación (store file + types file) es intencional — el store exporta para consumers directos, `types/` exporta para archivos que no dependen del store.

### 4. Contact usa useState local en lugar de Zustand

**Decisión:** El módulo `contact` no tiene store de Zustand. El hook `useContact.ts` usa `useState` para `isLoading`, `error` y `confirmation`.

**Por qué:** El plan de Fase 1.5 lo especificaba explícitamente: *el módulo de contacto no necesita caché ni estado global entre navegaciones*. El hook local con `useState` es suficiente y más simple. Si en el futuro se necesita estado global (ej: historial de tickets), se crea el store.

### 5. Mock con latencia variable y tasa de error del 10%

**Decisión:** Cada handler simula `delay(500, 1200)` y tiene un 10% de probabilidad de devolver `500 INTERNAL_SERVER_ERROR`.

**Por qué:** Hace el sistema realista. El frontend está forzado a manejar estados de error desde el inicio, no como parche después. Además demuestra que los hooks y stores funcionan correctamente bajo condiciones adversas.

### 6. Fórmula de Haversine para geolocalización

**Decisión:** `getNearestBranch` calcula la sucursal más cercana usando la fórmula Haversine implementada en `haversine.util.ts`.

**Por qué:** No dependemos de APIs externas de mapas. La fórmula de Haversine es suficiente para distancias en el Eje Cafetero (radio terrestre de 6371 km). Las 6 sucursales tienen coordenadas reales (lat/lng de Manizales, Pereira, Dosquebradas, Armenia y Circasia).

### 7. AbortController en el closure del módulo

**Decisión:** `let abortController: AbortController | null = null` vive fuera del `create()`, en el closure del módulo.

**Por qué:** El plan de Fase 1.5 lo especificaba: *variable en el closure del módulo, no en el estado*. El estado de Zustand es reactivo; el AbortController es un mecanismo de cancelación que no debe ser parte del estado. Esto permite abortar requests sin causar re-renders.

### 8. Flujo de pantallas: Catalog → Detail → Selector de sucursal → Formulario → Recibo

**Decisión:** El flujo de pedido es: agregar libro(s) → seleccionar sucursal → formulario → recibo.

**Por qué:** Este flujo garantiza que la sucursal esté seleccionada antes de entrar al formulario de pedido, cumpliendo con la regla del plan: *la sucursal elegida se pasa al módulo de orders como parte del payload*.

---

## Estructura de Archivos

```
src/
├── core/
│   └── api/
│       ├── adapter/
│       │   ├── IApiAdapter.ts        # Interfaz que define los 6 métodos
│       │   └── mock.adapter.ts      # Implementación mock
│       └── types/
│           └── api-response.types.ts # ApiResponse<T> genérico
│
├── mock/
│   ├── data/
│   │   ├── books.data.ts            # 40 libros con datos completos
│   │   └── branches.data.ts        # 6 sucursales del Eje Cafetero
│   ├── handlers/
│   │   ├── products.handler.ts     # getProducts, getProductById
│   │   ├── branches.handler.ts     # getBranches, getNearestBranch
│   │   ├── orders.handler.ts       # createOrder + validación
│   │   └── contact.handler.ts     # sendContactMessage + 429
│   └── utils/
│       ├── delay.util.ts           # delay(500, 1200)
│       ├── haversine.util.ts      # Fórmula de Haversine
│       └── mock-response.util.ts  # mockSuccess / mockError
│
├── modules/
│   ├── products/
│   ├── branches/
│   │   ├── utils/geolocation.util.ts  # navigator.geolocation wrapper
│   │   └── screens/BranchSelectorScreen.tsx
│   ├── orders/
│   └── contact/
│
└── shared/types/                    # Book, Branch, OrderReceipt, etc.
```

---

## Endpoints Implementados (Mock API)

| Endpoint | Códigos | Descripción |
|---|---|---|
| `getProducts(filters?)` | 200, 500 | Catálogo con filtros: genre, priceMax, available |
| `getProductById(id)` | 200, 404, 500 | Detalle de libro por ID |
| `getBranches()` | 200, 500 | Lista de 6 sucursales |
| `getNearestBranch(coords)` | 200, 404, 400, 500 | Sucursal más cercana (Haversine) |
| `createOrder(payload)` | 201, 400, 409, 500 | Crear pedido con validación completa |
| `sendContactMessage(payload)` | 201, 400, 422, 429, 500 | Contacto (máx 3/sesión) |

La documentación completa está en `README_API.md`.

---

## Convenciones de Estado (Zustand)

| Campo | Propósito |
|---|---|
| `isLoading: boolean` | Indica request en curso. Se activa al inicio de cada acción `fetch*`. |
| `isStale: boolean` | Datos desactualizados. Se activa con `markAsStale()` o `setFilters()`. El hook detecta y refetch. |
| `error: string \| null` | Solo el mensaje legible. Nunca el objeto de error completo. |
| `markAsStale()` | Limpia datos y marca `isStale: true`. |
| `reset()` | Restaura estado inicial. Cancela requests pendientes con AbortController. |

---

## Validaciones Implementadas

### createOrder (mock)
- Campos requeridos: customer (nombre, email, teléfono)
- Al menos 1 ítem, cantidad mínima 1
- `delivery.branchId` obligatorio
- Si `home_delivery`: requiere address y city
- Stock suficiente por ítem (`409 INSUFFICIENT_STOCK`)
- Sucursal debe existir

### sendContactMessage (mock)
- Todos los campos requeridos
- Email con formato válido (regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Mensaje mínimo 10 caracteres (`422 MESSAGE_TOO_SHORT`)
- Máximo 3 envíos por sesión (`429 TOO_MANY_REQUESTS`)

---

## Datos de Catálogo

- **40 libros** en `books.data.ts` distribuidos en 11 géneros (Novela, Misterio, Clásico, Romance, Cuento, Ficción, Ciencia ficción, Fantasía, Terror, Divulgación, Autoayuda)
- **6 sucursales** en `branches.data.ts` en Caldas, Risaralda y Quindío
- 3 libros con `stock: 0` (agotados) para probar filtros
- Precios entre COP 20.000 y 55.000

---

## TypeScript Strict Mode

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "erasableSyntaxOnly": true
}
```

Resultado: **0 errores de compilación**. Las 4 advertencias de ESLint son de `react-hooks/exhaustive-deps` en hooks que consumen stores de Zustand — son intencionales porque las funciones del store son estables en memoria y no deben incluirse en el dependency array.

---

**Última actualización:** 13 de mayo de 2026