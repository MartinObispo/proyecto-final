
/*
 * PA3 - Criptografía
 * Requerimiento 7: Ejemplos prácticos interactivos
 * Proyecto CryptoSec
 */

// Ejemplos educativos para los algoritmos disponibles
const ejemplosCriptografia = {
  cesar: {
    mensaje: "HOLA",
    clave: "3",
    explicacion: "El cifrado César desplaza cada letra tres posiciones en el alfabeto."
  },
  vigenere: {
    mensaje: "HOLA",
    clave: "CLAVE",
    explicacion: "Vigenère utiliza una palabra clave para aplicar diferentes desplazamientos."
  },
  aes: {
    mensaje: "MENSAJE DE PRUEBA",
    clave: "ClaveDemo2026!",
    explicacion: "AES-GCM cifra el mensaje utilizando una clave derivada de una contraseña."
  }
};



function cargarEjemplo() {
  const algoritmo = document.getElementById("seleccionarEjemplo").value;
  const ejemplo = ejemplosCriptografia[algoritmo];

  if (!ejemplo) return;

  document.getElementById("mensaje").value = ejemplo.mensaje;
  document.getElementById("algoritmo").value = algoritmo;
  document.getElementById("clave").value = ejemplo.clave;

  document.getElementById("explicacionEjemplo").textContent =
    ejemplo.explicacion;

  document.getElementById("resultado").textContent = "";

  document.getElementById("mensaje").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}
