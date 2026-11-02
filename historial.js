
/*
 * PA3 - Criptografía
 * Requerimiento 8: Historial de operaciones
 * Proyecto CryptoSec
 */

// Historial de operaciones de la sesión
const historialOperaciones = [];

function registrarOperacion(tipo, algoritmo, mensaje) {
    const operacion = {
        tipo: tipo,
        algoritmo: algoritmo,
        mensaje: mensaje,
        fecha: new Date().toLocaleString("es-PE")
    };

    historialOperaciones.push(operacion);
    mostrarHistorial();
}

function mostrarHistorial() {
    const contenedor = document.getElementById("historialOperaciones");

    if (!contenedor) return;

    contenedor.replaceChildren();

    if (historialOperaciones.length === 0) {
        contenedor.textContent = "Todavía no se han registrado operaciones.";
        return;
    }

    historialOperaciones.forEach((operacion, indice) => {
        const elemento = document.createElement("p");

        elemento.textContent =
            `${indice + 1}. ${operacion.tipo} | ` +
            `Algoritmo: ${operacion.algoritmo} | ` +
            `Fecha: ${operacion.fecha}`;

        contenedor.appendChild(elemento);
    });
}

function limpiarHistorial() {
    historialOperaciones.length = 0;
    mostrarHistorial();
}
