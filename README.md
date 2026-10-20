# Simulador de Cuotas – Pre-Entrega 7

Pre-Entrega 7 del curso de JavaScript de Coderhouse: **Interfaz dinámica con DOM y eventos**.

Es el mismo simulador de las entregas anteriores: el usuario elige un producto y ve cuánto paga por cuota
(**sin interés**: `precio / cuotas`). En esta entrega se dejan los `prompt`, `alert` y `console.log`:
todo pasa en la página. La lista de compras (un array de objetos `Producto`) se dibuja en pantalla con el DOM
y se actualiza sola con cada acción, sin recargar la página.

## Cómo usarlo

Abrí `index.html` en el navegador.

| Sección | Qué podés hacer |
|---|---|
| Agregar un producto | Completá nombre, categoría, precio y stock y tocá **+ Agregar** (o Enter). Si marcás "Es prioridad" va al principio de la lista |
| Mensaje | Debajo del formulario aparece el resultado de cada acción: verde si salió bien, rojo si hubo un error, amarillo para descuentos y eliminados |
| Tu lista de compras | Cada producto es una tarjeta. Elegí 1, 3, 6 o 12 cuotas y se calcula el valor de cada cuota al instante |
| Botones de cada tarjeta | **Comprar** (resta 1 del stock), **-10%** (descuento) y **Eliminar** |
| Buscador | Filtra la lista mientras escribís, por nombre o categoría (no distingue mayúsculas) |
| Total de tu lista | La suma de todos los productos y cuánto sería en el plan de cuotas que elijas |

El producto que se agregó, compró o descontó queda **resaltado** con un borde. Si un producto se queda sin stock,
la tarjeta se ve apagada y el botón dice "Sin stock".

## Dónde está cada punto de la consigna

| Consigna | Dónde está en `js/main.js` |
|---|---|
| Selección de elementos | `getElementById` para el formulario y `querySelector` para la búsqueda, la lista, el mensaje y el resumen (sección "ELEMENTOS DEL DOM"). `querySelector` dentro de cada tarjeta para sus botones |
| Renderizado dinámico | `renderizarProductos`: limpia `#contenedor-productos` y con `forEach` crea una tarjeta por producto con `innerHTML` y backticks (nombre en `<h3>`, precio en `<p>`) |
| Actualizar la vista | `actualizarVista` se llama cada vez que cambia el array (agregar, comprar, descontar, eliminar, buscar) |
| Feedback visual | `mostrarMensaje(texto, tipo)` cambia el texto y la clase de `#mensaje`; la clase `resaltado` marca la tarjeta que cambió |
| Evento click | `#boton-agregar` y los botones Comprar, -10% y Eliminar de cada tarjeta |
| Evento de teclado | `keyup` en el buscador (filtra la lista) y `keydown` con Enter en los inputs del formulario |
| Evento change | Los `<select>` de cuotas recalculan el valor de la cuota y el total |
| Sin prompt / alert / console.log | Todo se muestra en la página |

## Lo que viene de entregas anteriores

- **Clase `Producto` (Pre-Entrega 5):** `calcularCuota(cuotas)`, `vender()` y `aplicarDescuento(porcentaje)`.
- **Arrays (Pre-Entrega 4):** `push`/`unshift` para agregar, `indexOf` + `splice` para eliminar.
- **Funciones de orden superior (Pre-Entrega 6):** `forEach` para dibujar, `filter` para el buscador,
  `some` para no repetir productos, `map` + `join` para las opciones de cuotas y `reduce` para el total.
- **Funciones y condicionales (Pre-Entregas 2 y 3):** validación de cada dato con `if...else if`,
  "1 cuota" en singular.

## Estructura

```
├── index.html      # enlaza ./css/style.css y ./js/main.js (con defer)
├── css/
│   └── style.css   # colores, layout en grilla y estados (resaltado, sin stock, mensajes)
├── js/
│   └── main.js     # la clase Producto, el renderizado y los eventos
└── README.md
```

## Autor

Benjamín Murillo
