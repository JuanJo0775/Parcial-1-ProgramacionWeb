# Letras del Eje 

**Página web de librería con sucursales en el Eje Cafetero colombiano (Caldas, Risaralda, Quindío)**

Parcial 1 — Programación con Tecnologías Web · V Semestre

Juan Jose Naranjo - (JuanJo0775)
Laura Gabriela Velez - (lauvel19)

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

La documentación completa de la Mock API se encuentra en [README_API.md](README_API.md).

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