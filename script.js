const boton = document.getElementById('btn-generar');
const selectCantidad = document.getElementById('cantidad');
const selectFormato = document.getElementById('formato');
const contenedor = document.getElementById('contenedor-paleta');
const liveRegion = document.getElementById('live-region');

function generarValoresHSL() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 65; // Colores con buen contraste
    const l = Math.floor(Math.random() * 20) + 45; // Ni muy claros ni muy oscuros
    return { h, s, l };
}

function formatearHSL(h, s, l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function hslAHex(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hslARgba(h, s, l) {
    const hex = hslAHex(h, s, l);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 1)`;
}

// Función para lanzar el Microfeedback (Toast)
function mostrarFeedback(texto) {
    // Eliminar toasts anteriores si existen
    const toastExistente = document.querySelector('.toast');
    if (toastExistente) toastExistente.remove();

    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = `¡Copiado: ${texto}!`;
    
    document.body.appendChild(toast);

    // Accesibilidad: Avisar al lector de pantalla
    liveRegion.textContent = `Color ${texto} copiado al portapapeles`;

    // Quitar del DOM después de que termine la animación
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Función para copiar texto al portapapeles de manera segura
function copiarAlPortapapeles(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => mostrarFeedback(texto))
        .catch(() => console.error('No se pudo copiar el código'));
}

function renderizarPaleta() {  
    contenedor.innerHTML = '';
    const cantidad = parseInt(selectCantidad.value);
    const formatoElegido = selectFormato.value;

    for (let i = 0; i < cantidad; i++) {
        const { h, s, l } = generarValoresHSL();
        const hex = hslAHex(h, s, l);
        const hsl = formatearHSL(h, s, l);
        const secundario = (formatoElegido === 'HEX') ? hex : hslARgba(h, s, l);

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-color');

        const bloqueColor = document.createElement('div');
        bloqueColor.classList.add('bloque-color');
        bloqueColor.style.backgroundColor = hex;

        const infoColor = document.createElement('div');
        infoColor.classList.add('info-color');

        // Botón interactivo para el código HEX (Obligatorio por tu requerimiento)
        const btnHex = document.createElement('button');
        btnHex.classList.add('btn-copiar');
        btnHex.textContent = hex;
        btnHex.setAttribute('aria-label', `Copiar código hexadecimal ${hex}`);
        btnHex.addEventListener('click', () => copiarAlPortapapeles(hex));

        // Botón interactivo para el formato secundario (HSL o RGBA)
        const btnSecundario = document.createElement('button');
        btnSecundario.classList.add('btn-copiar');
        btnSecundario.textContent = secundario;
        btnSecundario.setAttribute('aria-label', `Copiar código alternativo ${secundario}`);
        btnSecundario.addEventListener('click', () => copiarAlPortapapeles(secundario));

        infoColor.appendChild(btnHex);
        infoColor.appendChild(btnSecundario);
        tarjeta.appendChild(bloqueColor);
        tarjeta.appendChild(infoColor);
        contenedor.appendChild(tarjeta);
    }
}

// Eventos
boton.addEventListener('click', renderizarPaleta);
selectCantidad.addEventListener('change', renderizarPaleta);
selectFormato.addEventListener('change', renderizarPaleta);

// Carga inicial obligatoria
renderizarPaleta();