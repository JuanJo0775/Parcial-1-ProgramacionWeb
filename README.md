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

## 🎮 Comandos Importantes

```bash
# Desarrollo
npm run dev              # Inicia servidor en http://localhost:5173

# Build
npm run build            # Compila para producción

# Preview
npm run preview          # Previsualiza la build de producción localmente

# Linting
npm lint                 # Verifica errores de código (ESLint)
```

---

## ⚙️ Configuración

### Variables de Entorno
El archivo `.env` contiene:
```
VITE_USE_MOCK=true
```

**Esto significa:** La aplicación siempre usa la API simulada. No requiere backend real ni conexión a internet.

### TypeScript Strict Mode
- `"strict": true` — Validación estricta de tipos
- `"noUncheckedIndexedAccess": true` — Protección contra accesos a índices no verificados

---

## 🗂️ Fases de Implementación

### ✅ Fase 0 (Completa)
- Setup del proyecto
- Estructura de carpetas
- Dependencias instaladas

### 📋 Fase 1 (Back - Mock API)
- [ ] Tipos compartidos
- [ ] Adaptador de API
- [ ] Datos semilla
- [ ] Utilidades del mock
- [ ] Handlers por dominio
- [ ] Servicios de módulos

### 📋 Fase 2 (Front - Componentes React)
- [ ] Componentes visuales
- [ ] Pantallas completas
- [ ] Sistema de rutas
- [ ] Estilos y responsividad

---

## 👥 Para el Equipo

### Descargar dependencias (primera vez)
```bash
npm install
```

### Si hay cambios en `package.json`
```bash
npm install
```

### Verificar que todo está bien
```bash
npm run dev     # Debería iniciar sin errores
```

---

## 📝 Notas Importantes

- **No modificar** `package-lock.json` manualmente. npm lo genera automáticamente.
- **Antes de hacer commits:** ejecuta `npm lint` para revisar el código
- **Mock API:** simula latencia (500-1200ms) y errores (10% de probabilidad) para ser realista
- **TypeScript Strict:** el compilador es estricto intencionalmente. Resolver todos los errores es obligatorio.

---

## 🔗 Documentación Adicional

Ver documentos en la raíz del proyecto:
- `plan-trabajo-fase-1-back.md` — Especificación técnica del mock API
- `plan-trabajo-fase-1.5.md` — Arquitectura de módulos y Zustand

---

**Última actualización:** 13 de mayo de 2026
