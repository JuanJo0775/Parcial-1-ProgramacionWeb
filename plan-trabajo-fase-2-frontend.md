# Plan de Trabajo — Fase 2 (Frontend)
### Parcial 1 · Programacion con Tecnologias Web · V Semestre

> **Alcance:** Implementar la interfaz (React + Vite) con semantica HTML, usabilidad, responsividad y consumo de la Mock API existente. Las fases 1 y 1.5 ya estan completas; esta fase se basa en su estructura, stores y servicios.

---

## 1. Objetivo de la fase
Construir la interfaz completa del proyecto **Letras del Eje** cumpliendo los requisitos de:
- Semantica HTML5 y jerarquia de encabezados.
- Layout responsivo (desktop y movil).
- Usabilidad (estados de carga, mensajes de error, confirmaciones, estados vacios).
- Consumo real de la Mock API a traves de los servicios y hooks definidos.

---

## 2. Alcance funcional (vistas minimas)
Se implementaran al menos **3 vistas** con interaccion real:
1. **Landing / Inicio**: Presentacion de la libreria y llamada a la accion principal.
2. **Catalogo + detalle**: Listado con filtros y vista de detalle del libro.
3. **Compra / pedido**: Flujo de seleccion de sucursal + formulario + recibo.
4. **Contacto**: Formulario con validaciones y confirmacion.

> Nota: Las vistas 1-3 cumplen el requisito minimo. La vista de contacto se incluye para completar el flujo del proyecto.

---

## 3. Estructura de archivos (frontend)
Se respetara la estructura creada en la Fase 1.5:

```
src/
├── App.tsx                     # Layout general + rutas
├── main.tsx                    # Render principal
├── App.css / index.css         # Estilos base y layout global
└── modules/
    ├── products/
    │   ├── components/BookCard.tsx
    │   └── screens/CatalogScreen.tsx
    │   └── screens/ProductDetailScreen.tsx
    ├── branches/
    │   ├── components/BranchCard.tsx
    │   └── screens/BranchSelectorScreen.tsx
    ├── orders/
    │   ├── screens/OrderFormScreen.tsx
    │   └── screens/OrderReceiptScreen.tsx
    └── contact/
        └── screens/ContactScreen.tsx
```

---

## 4. Requisitos de semantica HTML
En cada pantalla se aplicara:
- `header`, `nav`, `main`, `section`, `article`, `footer` segun corresponda.
- Jerarquia de encabezados: un solo `h1` por vista, `h2` para secciones principales, `h3` para subsecciones.
- Formularios con `label` visible y `htmlFor` asociado.
- Tipos correctos en inputs: `email`, `tel`, `number`, `date`, etc.

---

## 5. Requisitos de usabilidad
- Botones con texto especifico (ej: "Buscar sucursal", "Confirmar pedido", "Enviar mensaje de contacto").
- Estados de carga visibles: boton deshabilitado y texto alterno (ej: "Enviando...", "Cargando catalogo...").
- Mensajes de error claros y accionables (ej: "Ingresa un correo valido").
- Confirmacion para acciones irreversibles (ej: cancelar pedido o limpiar formulario).
- Estados vacios con mensaje (ej: "No hay libros disponibles con estos filtros").

---

## 6. Requisitos de responsividad
- Layout con Flexbox / Grid.
- Breakpoints minimos para movil (<= 480px) y desktop (>= 1024px).
- Componentes adaptables (tarjetas apiladas en movil, grilla en desktop).
- Sin desbordes horizontales ni contenido fuera de pantalla.

---

## 7. Flujo de pantallas y reglas de negocio
Se sigue el flujo descrito en README_LOGICA.md:
1. Catalogo -> detalle.
2. Seleccion de sucursal (nearest o manual si geolocation denegada).
3. Formulario de pedido.
4. Recibo con resumen y total.
5. Contacto independiente.

---

## 8. Plan de trabajo por pasos

### Paso 1 — Layout general y navegacion
- Definir layout base con `header`, `nav`, `main`, `footer`.
- Crear navegacion principal a las pantallas (Home, Catalogo, Pedido, Contacto).

### Paso 2 — Catalogo y detalle
- Implementar `CatalogScreen` con filtros y lista de libros.
- Renderizar `BookCard` por cada item.
- Implementar estado vacio y estado de carga.
- Implementar `ProductDetailScreen` con detalle del libro.

### Paso 3 — Sucursales
- Implementar `BranchSelectorScreen`.
- Integrar geolocalizacion (nearest branch) y fallback a lista manual.
- Renderizar `BranchCard` con accion "Elegir sucursal".

### Paso 4 — Pedido
- Implementar `OrderFormScreen` con validaciones.
- Integrar store `orders` y enviar payload al mock.
- Implementar estados de carga y errores.

### Paso 5 — Recibo
- Implementar `OrderReceiptScreen` con resumen y detalles del pedido.
- Mostrar mensaje de exito y boton para "Nuevo pedido".

### Paso 6 — Contacto
- Implementar `ContactScreen` con validaciones y confirmacion.
- Mostrar estado de carga y mensajes de error.

### Paso 7 — Responsividad y ajustes finales
- Ajustar grillas, tamanos de texto y paddings.
- Probar en mobile y desktop.
- Revisar estados vacios, mensajes y botones.

---

## 9. Checklist de entrega (Fase 2)
- [ ] 3 vistas minimo con interaccion real.
- [ ] Semantica HTML5 aplicada.
- [ ] Formularios con labels y tipos correctos.
- [ ] Estados de carga, error y vacio implementados.
- [ ] Responsivo en movil y desktop.
- [ ] Consumo de mock API desde servicios/hooks.
- [ ] README actualizado con capturas (opcional segun docente).

---

## 10. Consideraciones finales
- No modificar `package-lock.json` manualmente.
- Evitar llamadas directas a la API desde componentes: usar hooks -> store -> services.
- Mantener consistencia de estilos en todas las pantallas.

---

*Plan de trabajo para Fase 2 (Frontend). Actualizar checkboxes conforme avance la implementacion.*
