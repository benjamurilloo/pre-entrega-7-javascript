// Simulador de Cuotas - Pre-Entrega 7

// ===== CLASE =====

// Class: la "fábrica" de productos que el usuario puede pagar en cuotas
class Producto {
    // constructor: recibe los datos y los guarda en el objeto con this
    constructor(id, nombre, categoria, precio, stock) {
        this.id = id
        this.nombre = nombre
        this.categoria = categoria
        this.precio = precio
        this.stock = stock
    }

    // Método: calcula el valor de cada cuota (sin interés, como en la Pre-Entrega 1)
    calcularCuota(cuotas) {
        return this.precio / cuotas
    }

    // Método: baja el precio según el porcentaje. Retorna false si el porcentaje no es válido
    aplicarDescuento(porcentaje) {
        if (porcentaje <= 0 || porcentaje >= 100) {
            return false
        }
        this.precio = this.precio - (this.precio * porcentaje) / 100
        return true
    }

    // Método: resta una unidad del stock. Retorna false si no quedan unidades
    vender() {
        if (this.stock === 0) {
            return false
        }
        this.stock--
        return true
    }
}

// ===== DATOS =====

// Instancias: cada producto es un objeto creado con new a partir de la clase
const celular = new Producto(1, "Celular", "Tecnología", 450000, 5)
const notebook = new Producto(2, "Notebook", "Tecnología", 900000, 3)
const auriculares = new Producto(3, "Auriculares", "Tecnología", 60000, 10)
const zapatillas = new Producto(4, "Zapatillas", "Indumentaria", 120000, 8)
const televisor = new Producto(5, "Televisor", "Electrodomésticos", 700000, 2)

// Array: la lista de compras que se dibuja en pantalla
const listaDeCompras = [celular, notebook, auriculares, zapatillas, televisor]

// Array: los planes de cuotas disponibles (todos sin interés)
const planesDeCuotas = [1, 3, 6, 12]

// let: el id que va a recibir el próximo producto que se agregue
let proximoId = 6

// let: el id del último producto que cambió, para resaltar su tarjeta
let idResaltado = null

// ===== ELEMENTOS DEL DOM =====

// getElementById: los inputs y el botón del formulario
const inputNombre = document.getElementById("input-nombre")
const inputCategoria = document.getElementById("input-categoria")
const inputPrecio = document.getElementById("input-precio")
const inputStock = document.getElementById("input-stock")
const checkPrioridad = document.getElementById("check-prioridad")
const botonAgregar = document.getElementById("boton-agregar")

// querySelector: la búsqueda, la lista, el mensaje y el resumen
const inputBuscar = document.querySelector("#input-buscar")
const contenedorProductos = document.querySelector("#contenedor-productos")
const contador = document.querySelector("#contador")
const mensaje = document.querySelector("#mensaje")
const totalLista = document.querySelector("#total-lista")
const selectCuotasTotal = document.querySelector("#select-cuotas-total")
const valorCuotaTotal = document.querySelector("#valor-cuota-total")

// ===== FUNCIONES =====

// Función flecha: devuelve el precio con el signo $ y dos decimales
const formatearPrecio = (valor) => `$${valor.toFixed(2)}`

// Función declarada: devuelve "1 cuota" o "N cuotas" según la cantidad
function textoCuotas(cuotas) {
    if (cuotas === 1) {
        return "1 cuota"
    }
    return `${cuotas} cuotas`
}

// Función declarada: arma las opciones de un <select> con los planes de cuotas
function crearOpcionesCuotas() {
    // map: transforma cada plan en un <option>, y join los une en un solo texto
    return planesDeCuotas.map((cuotas) => `<option value="${cuotas}">${textoCuotas(cuotas)}</option>`).join("")
}

// Función declarada (feedback): muestra un mensaje en pantalla con el color según el tipo
function mostrarMensaje(texto, tipo) {
    mensaje.innerText = texto
    // className: cambia la clase para que el CSS lo pinte de verde, rojo o amarillo
    mensaje.className = `mensaje mensaje-${tipo}`
}

// Función declarada (renderizado): limpia el contenedor y dibuja una tarjeta por producto
function renderizarProductos(productos, textoVacio) {
    contenedorProductos.innerHTML = ""

    if (productos.length === 0) {
        contenedorProductos.innerHTML = `<p class="lista-vacia">${textoVacio}</p>`
        return
    }

    // forEach: crea una tarjeta para cada producto del array
    productos.forEach((producto) => {
        const tarjeta = document.createElement("article")
        tarjeta.className = "tarjeta"

        // innerHTML + backticks: las propiedades del objeto se ven en la tarjeta
        tarjeta.innerHTML = `
            <span class="categoria">${producto.categoria}</span>
            <h3>${producto.nombre}</h3>
            <p class="precio">${formatearPrecio(producto.precio)}</p>
            <p class="stock">Stock: ${producto.stock}</p>
            <label>
                Cuotas
                <select class="select-cuotas">${crearOpcionesCuotas()}</select>
            </label>
            <p class="valor-cuota">1 cuota de ${formatearPrecio(producto.calcularCuota(1))}</p>
            <div class="acciones">
                <button class="boton boton-comprar">Comprar</button>
                <button class="boton boton-descuento">-10%</button>
                <button class="boton boton-eliminar">Eliminar</button>
            </div>
        `

        // if: estados visuales de la tarjeta
        if (producto.id === idResaltado) {
            tarjeta.classList.add("resaltado")
        }

        const botonComprar = tarjeta.querySelector(".boton-comprar")
        if (producto.stock === 0) {
            tarjeta.classList.add("sin-stock")
            botonComprar.disabled = true
            botonComprar.innerText = "Sin stock"
        }

        contenedorProductos.appendChild(tarjeta)

        // Evento change: al elegir otro plan se recalcula el valor de la cuota
        const selectCuotas = tarjeta.querySelector(".select-cuotas")
        const valorCuota = tarjeta.querySelector(".valor-cuota")
        selectCuotas.addEventListener("change", () => {
            const cuotas = parseInt(selectCuotas.value)
            valorCuota.innerText = `${textoCuotas(cuotas)} de ${formatearPrecio(producto.calcularCuota(cuotas))}`
        })

        // Eventos click: cada botón llama a su función con el producto de esta tarjeta
        botonComprar.addEventListener("click", () => {
            comprarProducto(producto, parseInt(selectCuotas.value))
        })
        tarjeta.querySelector(".boton-descuento").addEventListener("click", () => {
            descontarProducto(producto)
        })
        tarjeta.querySelector(".boton-eliminar").addEventListener("click", () => {
            eliminarProducto(producto)
        })
    })
}

// Función declarada: calcula el total de la lista y lo muestra en cuotas
function actualizarResumen() {
    // reduce: acumula el precio de cada producto empezando desde 0
    const total = listaDeCompras.reduce((acumulado, p) => acumulado + p.precio, 0)
    const cuotas = parseInt(selectCuotasTotal.value)

    totalLista.innerText = `${formatearPrecio(total)} (${listaDeCompras.length} productos)`
    valorCuotaTotal.innerText = `${textoCuotas(cuotas)} de ${formatearPrecio(total / cuotas)}`
}

// Función declarada: filtra según la búsqueda y vuelve a dibujar todo (se llama cada vez que cambia el array)
function actualizarVista() {
    const texto = inputBuscar.value.trim().toLowerCase()

    // filter: se queda con los productos cuyo nombre o categoría contienen el texto buscado
    const visibles = listaDeCompras.filter((p) =>
        p.nombre.toLowerCase().includes(texto) || p.categoria.toLowerCase().includes(texto)
    )

    // if: el texto que se muestra si no hay nada para dibujar
    let textoVacio = `No hay productos que coincidan con "${inputBuscar.value}"`
    if (listaDeCompras.length === 0) {
        textoVacio = "Tu lista está vacía. Agregá un producto con el formulario."
    }

    renderizarProductos(visibles, textoVacio)
    contador.innerText = `Mostrando ${visibles.length} de ${listaDeCompras.length} productos`
    actualizarResumen()
}

// Función declarada: lee el formulario, valida los datos y agrega el producto al array
function agregarProducto() {
    const nombre = inputNombre.value.trim()
    const categoria = inputCategoria.value.trim()
    const precio = parseFloat(inputPrecio.value)
    const stock = parseInt(inputStock.value)

    // if...else if: cada dato inválido muestra su propio error en pantalla
    if (nombre === "") {
        mostrarMensaje("❌ Ingresá el nombre del producto", "error")
        inputNombre.focus()
    } else if (listaDeCompras.some((p) => p.nombre.toLowerCase() === nombre.toLowerCase())) {
        // some: retorna true si ya hay un producto con ese nombre
        mostrarMensaje(`❌ "${nombre}" ya está en tu lista`, "error")
        inputNombre.focus()
    } else if (categoria === "") {
        mostrarMensaje("❌ Ingresá la categoría del producto", "error")
        inputCategoria.focus()
    } else if (isNaN(precio) || precio <= 0) {
        mostrarMensaje("❌ Precio inválido. Ingresá un número mayor a 0", "error")
        inputPrecio.focus()
    } else if (isNaN(stock) || stock <= 0) {
        mostrarMensaje("❌ Stock inválido. Ingresá un número entero mayor a 0", "error")
        inputStock.focus()
    } else {
        const nuevo = new Producto(proximoId, nombre, categoria, precio, stock)
        proximoId++

        // if: si es prioridad entra al principio (unshift), si no, al final (push)
        if (checkPrioridad.checked) {
            listaDeCompras.unshift(nuevo)
            mostrarMensaje(`✅ "${nuevo.nombre}" se agregó al principio de la lista`, "exito")
        } else {
            listaDeCompras.push(nuevo)
            mostrarMensaje(`✅ "${nuevo.nombre}" se agregó al final de la lista`, "exito")
        }

        // Limpia el formulario para cargar otro producto
        inputNombre.value = ""
        inputCategoria.value = ""
        inputPrecio.value = ""
        inputStock.value = ""
        checkPrioridad.checked = false
        inputNombre.focus()

        idResaltado = nuevo.id
        actualizarVista()
    }
}

// Función declarada: vende una unidad y muestra cuánto se paga por cuota
function comprarProducto(producto, cuotas) {
    // vender() retorna false cuando no queda stock
    if (!producto.vender()) {
        mostrarMensaje(`❌ No queda stock de ${producto.nombre}`, "error")
    } else {
        mostrarMensaje(
            `✅ Compraste ${producto.nombre} en ${textoCuotas(cuotas)} de ${formatearPrecio(producto.calcularCuota(cuotas))}. ` +
            `Stock restante: ${producto.stock}`,
            "exito"
        )
    }
    idResaltado = producto.id
    actualizarVista()
}

// Función declarada: aplica un 10% de descuento con el método aplicarDescuento()
function descontarProducto(producto) {
    const precioAnterior = producto.precio
    producto.aplicarDescuento(10)
    mostrarMensaje(
        `🏷️ ${producto.nombre} bajó de ${formatearPrecio(precioAnterior)} a ${formatearPrecio(producto.precio)}`,
        "aviso"
    )
    idResaltado = producto.id
    actualizarVista()
}

// Función declarada: saca el producto del array con splice
function eliminarProducto(producto) {
    // indexOf: busca la posición de ese objeto en la lista
    const indice = listaDeCompras.indexOf(producto)
    // splice: en esa posición saca 1 elemento y lo retorna en un array
    const eliminados = listaDeCompras.splice(indice, 1)
    mostrarMensaje(`🗑️ Se ha eliminado el elemento: ${eliminados[0].nombre}`, "aviso")
    idResaltado = null
    actualizarVista()
}

// ===== EVENTOS =====

// Evento click: el botón del formulario agrega el producto
botonAgregar.addEventListener("click", agregarProducto)

// Evento keydown: apretar Enter en cualquier input del formulario también agrega
const inputsFormulario = [inputNombre, inputCategoria, inputPrecio, inputStock]
inputsFormulario.forEach((input) => {
    input.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            agregarProducto()
        }
    })
})

// Evento keyup: cada tecla en la barra de búsqueda vuelve a filtrar la lista
inputBuscar.addEventListener("keyup", () => {
    idResaltado = null
    actualizarVista()
})

// Evento change: al cambiar las cuotas del total se recalcula el resumen
selectCuotasTotal.addEventListener("change", actualizarResumen)

// ===== INICIO =====

// Primer dibujo de la pantalla con los productos del array
selectCuotasTotal.innerHTML = crearOpcionesCuotas()
actualizarVista()
