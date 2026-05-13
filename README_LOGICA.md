## 1. Lógica de negocio del sistema

### 1.1 Contexto del producto

**Letras del Eje** es una librería ficticia con presencia física en el Eje Cafetero colombiano. La página web permite al usuario:

1. Explorar el catálogo de libros disponibles.
2. Ver el detalle de un libro específico.
3. Hacer un pedido de uno o varios libros con entrega a domicilio o retiro en sucursal.
4. Encontrar la sucursal más cercana a su ubicación.
5. Enviar un mensaje de contacto.

El sistema **no tiene autenticación**, **no tiene carrito persistente** y **no tiene pasarela de pago**. Todo el flujo de compra termina en un recibo que confirma el pedido con pago contra entrega o pago al recoger en tienda.

---

### 1.2 Flujo de compra — reglas de negocio

```
Usuario elige libro(s) y cantidad(es)
        │
        ▼
Usuario ingresa sus datos personales
(nombre completo, email, teléfono)
        │
        ▼
Sistema solicita ubicación (navigator.geolocation)
        │
        ├── Permiso concedido ──► Mock calcula sucursal más cercana (Haversine)
        │                         Usuario ve la sucursal sugerida y puede cambiarla
        │
        └── Permiso denegado ──► Se listan todas las sucursales (ciudad + nombre)
                                  Usuario elige manualmente la más conveniente
        │
        ▼
Usuario elige tipo de entrega:
  • Retiro en sucursal  → sin costo adicional
  • Domicilio          → requiere dirección y ciudad; costo fijo simulado (COP 8.000)
        │
        ▼
Sistema valida el pedido contra el mock:
  • Todos los campos requeridos presentes        → si falta alguno: 400
  • Stock suficiente para cada ítem              → si no: 409
  • Sin errores de servidor simulados            → si ocurre: 500
        │
        ▼
Mock devuelve recibo (OrderReceipt)
  • Número de orden  (ORD-YYYYMMDD-XXXX)
  • Resumen de ítems con subtotales
  • Total con o sin costo de domicilio
  • Instrucciones de pago (contra entrega / al recoger)
        │
        ▼
Frontend muestra el recibo en pantalla
(el usuario puede imprimirlo o guardarlo)
```

**Reglas adicionales:**
- Un pedido puede tener entre 1 y N libros distintos.
- La cantidad mínima por ítem es 1.
- Si el stock de un libro es 0, no se puede agregar al pedido (validación en frontend antes de llegar al mock).
- El mock siempre devuelve `paymentMethod: 'cash_on_delivery'` — no hay otra opción.
- El número de orden se genera en el mock con formato `ORD-YYYYMMDD-NNNN` donde NNNN es un contador en memoria que se reinicia con cada recarga.

---

### 1.3 Flujo de contacto — reglas de negocio

- El formulario requiere: nombre completo, email válido, asunto y mensaje (mínimo 10 caracteres).
- El mock permite máximo **3 envíos por sesión** (contador en memoria). Al superar el límite devuelve `429 Too Many Requests`.
- La respuesta exitosa devuelve un número de ticket (`TKT-YYYYMMDD-XXXX`) y un mensaje de confirmación.
- El frontend debe mostrar el número de ticket al usuario después del envío.

---

### 1.4 Datos de referencia (inmutables en esta versión)

| Recurso | Origen | Mutable por usuario |
|---|---|---|
| Catálogo de libros | `books.data.ts` | No |
| Sucursales | `branches.data.ts` | No |
| Costo de domicilio | Constante en `orders.handler.ts` (`8000`) | No |
| Tasa de error simulado | Constante `MOCK_ERROR_RATE = 0.1` | No (solo dev) |

---