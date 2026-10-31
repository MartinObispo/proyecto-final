// Cifrado César: la clave es un número (desplazamiento)
function aCesar(texto, clave) {
  const n = ((parseInt(clave, 10) % 26) + 26) % 26;
  return texto.replace(/[a-z]/gi, function (c) {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode((c.charCodeAt(0) - base + n) % 26 + base);
  });
}

// Cifrado Vigenère: la clave es una palabra
function aVigenere(texto, clave) {
  const k = clave.toUpperCase().replace(/[^A-Z]/g, '');
  if (!k) return null;
  let i = 0;
  return texto.replace(/[a-z]/gi, function (c) {
    const base = c <= 'Z' ? 65 : 97;
    const desplazamiento = k.charCodeAt(i++ % k.length) - 65;
    return String.fromCharCode((c.charCodeAt(0) - base + desplazamiento) % 26 + base);
  });
}

// AES-256-GCM: la clave es una contraseña
async function aAES(texto, clave) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const material = await crypto.subtle.importKey('raw', enc.encode(clave), 'PBKDF2', false, ['deriveKey']);
  const llave = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, llave, enc.encode(texto)));
  const todo = new Uint8Array(salt.length + iv.length + cifrado.length);
  todo.set(salt, 0);
  todo.set(iv, 16);
  todo.set(cifrado, 28);
  return btoa(String.fromCharCode(...todo));
}

// Función que usa el botón "Cifrar"
async function cifrarMensaje() {
  const texto = document.getElementById('mensaje').value;
  const algoritmo = document.getElementById('algoritmo').value;
  const clave = document.getElementById('clave').value;
  const salida = document.getElementById('resultado');

  if (!texto || !clave) {
    salida.textContent = 'Escribe un mensaje y una clave.';
    return;
  }

  let resultado;
  if (algoritmo === 'cesar') {
    if (isNaN(parseInt(clave, 10))) {
      salida.textContent = 'Para César la clave debe ser un número.';
      return;
    }
    resultado = aCesar(texto, clave);
  } else if (algoritmo === 'vigenere') {
    resultado = aVigenere(texto, clave);
    if (resultado === null) {
      salida.textContent = 'Para Vigenère la clave debe tener letras.';
      return;
    }
  } else {
    resultado = await aAES(texto, clave);
  }
  salida.textContent = resultado;
}
