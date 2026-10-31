// ==========================================
// Cifrado César: la clave es un número (desplazamiento)
// ==========================================

function aCesar(texto, clave) {
  const n = ((parseInt(clave, 10) % 26) + 26) % 26;
  return texto.replace(/[a-z]/gi, function (c) {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode((c.charCodeAt(0) - base + n) % 26 + base);
  });
}

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


// ==========================================
// REQUERIMIENTO 5: DESCIFRADO 
// ==========================================

function descifrarCesar(texto, clave) {
  const n = ((parseInt(clave, 10) % 26) + 26) % 26;
  return aCesar(texto, 26 - n);
}

function descifrarVigenere(texto, clave) {
  const k = clave.toUpperCase().replace(/[^A-Z]/g, '');
  if (!k) return null;
  let i = 0;
  return texto.replace(/[a-z]/gi, function (c) {
    const base = c <= 'Z' ? 65 : 97;
    const desplazamiento = k.charCodeAt(i++ % k.length) - 65;
    return String.fromCharCode((c.charCodeAt(0) - base - desplazamiento + 26) % 26 + base);
  });
}

async function descifrarAES(textoCifradoBase64, clave) {
  try {
    const dec = new TextDecoder();
    const enc = new TextEncoder();
    const todo = Uint8Array.from(atob(textoCifradoBase64), c => c.charCodeAt(0));
    
    const salt = todo.slice(0, 16);
    const iv = todo.slice(16, 28);
    const datosCifrados = todo.slice(28);

    const material = await crypto.subtle.importKey('raw', enc.encode(clave), 'PBKDF2', false, ['deriveKey']);
    const llave = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const descifrado = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, llave, datosCifrados);
    return dec.decode(descifrado);
  } catch (e) {
    return null;
  }
}

async function descifrarMensaje() {
  const texto = document.getElementById('mensajeDescifrar').value.trim();
  const algoritmo = document.getElementById('algoritmoDescifrar').value;
  const clave = document.getElementById('claveDescifrar').value.trim();
  const salida = document.getElementById('resultadoDescifrado');

  if (!texto || !clave) {
    salida.textContent = 'Escribe el mensaje cifrado y la clave.';
    return;
  }

  let resultado;
  if (algoritmo === 'cesar') {
    if (isNaN(parseInt(clave, 10))) {
      salida.textContent = 'Para César la clave debe ser un número.';
      return;
    }
    resultado = descifrarCesar(texto, clave);
  } else if (algoritmo === 'vigenere') {
    resultado = descifrarVigenere(texto, clave);
    if (resultado === null) {
      salida.textContent = 'Para Vigenère la clave debe contener letras.';
      return;
    }
  } else if (algoritmo === 'aes') {
    resultado = await descifrarAES(texto, clave);
    if (resultado === null) {
      salida.textContent = 'Error al descifrar: Clave incorrecta o formato inválido.';
      return;
    }
  }

  salida.textContent = resultado;
}


// ==========================================
// REQUERIMIENTO 6: GENERACIÓN DE CLAVES 
// ==========================================

function generarClaveAleatoria(targetInputId, selectAlgoritmoId) {
  const algoritmo = document.getElementById(selectAlgoritmoId).value;
  const inputClave = document.getElementById(targetInputId);
  let claveGenerada = '';

  if (algoritmo === 'cesar') {
    claveGenerada = Math.floor(Math.random() * 25) + 1;
  } else if (algoritmo === 'vigenere') {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 8; i++) {
      claveGenerada += letras.charAt(Math.floor(Math.random() * letras.length));
    }
  } else if (algoritmo === 'aes') {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    for (let i = 0; i < 16; i++) {
      claveGenerada += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
  }

  inputClave.value = claveGenerada;
}
