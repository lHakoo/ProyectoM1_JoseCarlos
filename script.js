// ─── Referencias al DOM ────────────────────────────────────────
const boton           = document.getElementById('btn-generar');
const btnGuardar      = document.getElementById('btn-guardar');
const btnLimpiar      = document.getElementById('btn-limpiar');
const selectCantidad  = document.getElementById('cantidad');
const selectFormato   = document.getElementById('formato');
const contenedor      = document.getElementById('contenedor-paleta');
const liveRegion      = document.getElementById('live-region');
const seccionGuardadas = document.getElementById('seccion-guardadas');
const listaGuardadas  = document.getElementById('lista-guardadas');

// ─── Estado ────────────────────────────────────────────────────
let estadoPaleta = [];
let primerasCarga = true;

// ─── Generación de colores ─────────────────────────────────────
function generarValoresHSL() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 65;
    const l = Math.floor(Math.random() * 20) + 45;
    return { h, s, l, bloqueado: false };
}

// ─── Conversiones ──────────────────────────────────────────────
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

function formatearHSL(h, s, l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

// ─── Toast (microfeedback) ─────────────────────────────────────
function mostrarToast(mensaje, tipo = 'success') {
    document.querySelector('.toast')?.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast--${tipo}`;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    liveRegion.textContent = mensaje;
    setTimeout(() => toast.remove(), 2900);
}

// ─── Copiar al portapapeles ────────────────────────────────────
function copiarAlPortapapeles(texto, btnEl) {
    navigator.clipboard.writeText(texto)
        .then(() => {
            mostrarToast(`Copiado: ${texto}`);
            if (btnEl) {
                btnEl.classList.add('copiado');
                setTimeout(() => btnEl.classList.remove('copiado'), 600);
            }
        })
        .catch(() => mostrarToast('No se pudo copiar', 'error'));
}

// ─── Bloqueo de color ──────────────────────────────────────────
function toggleBloqueo(index, tarjeta) {
    estadoPaleta[index].bloqueado = !estadoPaleta[index].bloqueado;
    tarjeta.classList.toggle('bloqueada', estadoPaleta[index].bloqueado);
    const bloqueado = estadoPaleta[index].bloqueado;
    tarjeta.querySelector('.bloque-color').setAttribute(
        'aria-label',
        bloqueado ? 'Color bloqueado. Clic para desbloquear' : 'Clic para bloquear este color'
    );
    liveRegion.textContent = bloqueado ? 'Color bloqueado' : 'Color desbloqueado';
}

// ─── Calcular formato secundario ───────────────────────────────
function calcularSecundario(formato, h, s, l) {
    if (formato === 'HSL')  return formatearHSL(h, s, l);
    if (formato === 'RGBA') return hslARgba(h, s, l);
    return hslARgba(h, s, l); // HEX seleccionado → secundario RGBA
}

// ─── Render de paleta ──────────────────────────────────────────
function renderizarPaleta() {
    const cantidad       = parseInt(selectCantidad.value);
    const formatoElegido = selectFormato.value;

    if (estadoPaleta.length === 0) {
        estadoPaleta = Array.from({ length: cantidad }, generarValoresHSL);
    } else {
        if (estadoPaleta.length < cantidad) {
            const extra = cantidad - estadoPaleta.length;
            for (let i = 0; i < extra; i++) estadoPaleta.push(generarValoresHSL());
        } else if (estadoPaleta.length > cantidad) {
            estadoPaleta = estadoPaleta.slice(0, cantidad);
        }
        estadoPaleta = estadoPaleta.map(c => c.bloqueado ? c : generarValoresHSL());
    }

    contenedor.innerHTML = '';

    estadoPaleta.forEach((color, index) => {
        const { h, s, l, bloqueado } = color;
        const hex        = hslAHex(h, s, l);
        const secundario = calcularSecundario(formatoElegido, h, s, l);

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-color');
        if (bloqueado) tarjeta.classList.add('bloqueada');

        const bloqueColor = document.createElement('div');
        bloqueColor.classList.add('bloque-color');
        bloqueColor.style.backgroundColor = hex;
        bloqueColor.setAttribute('role', 'button');
        bloqueColor.setAttribute('tabindex', '0');
        bloqueColor.setAttribute(
            'aria-label',
            bloqueado ? 'Color bloqueado. Clic para desbloquear' : 'Clic para bloquear este color'
        );

        const handleBloqueo = () => toggleBloqueo(index, tarjeta);
        bloqueColor.addEventListener('click', handleBloqueo);
        bloqueColor.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleBloqueo(); }
        });

        const infoColor = document.createElement('div');
        infoColor.classList.add('info-color');

        const btnHex = document.createElement('button');
        btnHex.classList.add('btn-copiar');
        btnHex.textContent = hex;
        btnHex.setAttribute('aria-label', `Copiar HEX ${hex}`);
        btnHex.addEventListener('click', () => copiarAlPortapapeles(hex, btnHex));

        const btnSecundario = document.createElement('button');
        btnSecundario.classList.add('btn-copiar');
        btnSecundario.textContent = secundario;
        btnSecundario.setAttribute('aria-label', `Copiar ${formatoElegido} ${secundario}`);
        btnSecundario.addEventListener('click', () => copiarAlPortapapeles(secundario, btnSecundario));

        infoColor.appendChild(btnHex);
        infoColor.appendChild(btnSecundario);
        tarjeta.appendChild(bloqueColor);
        tarjeta.appendChild(infoColor);
        contenedor.appendChild(tarjeta);
    });

    // Toast de generación (no en carga inicial)
    if (!primerasCarga) {
        const bloqueados = estadoPaleta.filter(c => c.bloqueado).length;
        const msg = bloqueados > 0
            ? `Paleta generada — ${bloqueados} color${bloqueados > 1 ? 'es' : ''} bloqueado${bloqueados > 1 ? 's' : ''}`
            : `Paleta generada — ${estadoPaleta.length} colores`;
        mostrarToast(msg, 'generate');
    }
    primerasCarga = false;
}

// ─── Guardado en localStorage ──────────────────────────────────
const STORAGE_KEY = 'paletas_guardadas';

function cargarPaletasGuardadas() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
}

function guardarPaletasEnStorage(paletas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paletas));
}

function guardarPaletaActual() {
    if (estadoPaleta.length === 0) return;
    const paletas = cargarPaletasGuardadas();
    const nueva = {
        id:      Date.now(),
        fecha:   new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        colores: estadoPaleta.map(({ h, s, l }) => hslAHex(h, s, l)),
    };
    paletas.unshift(nueva);
    guardarPaletasEnStorage(paletas);
    renderizarPaletasGuardadas();
    mostrarToast('Paleta guardada ✔');
}

function eliminarPaleta(id) {
    const paletas = cargarPaletasGuardadas().filter(p => p.id !== id);
    guardarPaletasEnStorage(paletas);
    renderizarPaletasGuardadas();
}

function limpiarTodasLasPaletas() {
    localStorage.removeItem(STORAGE_KEY);
    renderizarPaletasGuardadas();
}

function renderizarPaletasGuardadas() {
    const paletas = cargarPaletasGuardadas();
    seccionGuardadas.hidden = paletas.length === 0;
    listaGuardadas.innerHTML = '';

    paletas.forEach(paleta => {
        const fila = document.createElement('div');
        fila.classList.add('paleta-guardada');

        const chips = document.createElement('div');
        chips.classList.add('paleta-guardada-chips');
        paleta.colores.forEach(hex => {
            const chip = document.createElement('div');
            chip.classList.add('chip-color');
            chip.style.backgroundColor = hex;
            chip.title = hex;
            chip.setAttribute('role', 'button');
            chip.setAttribute('tabindex', '0');
            chip.setAttribute('aria-label', `Copiar ${hex}`);
            chip.addEventListener('click', () => copiarAlPortapapeles(hex));
            chip.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copiarAlPortapapeles(hex); }
            });
            chips.appendChild(chip);
        });

        const meta = document.createElement('div');
        meta.classList.add('paleta-guardada-meta');
        const fecha = document.createElement('span');
        fecha.classList.add('paleta-fecha');
        fecha.textContent = paleta.fecha;
        meta.appendChild(fecha);

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn-eliminar-paleta');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.setAttribute('aria-label', `Eliminar paleta guardada del ${paleta.fecha}`);
        btnEliminar.addEventListener('click', () => eliminarPaleta(paleta.id));

        fila.appendChild(chips);
        fila.appendChild(meta);
        fila.appendChild(btnEliminar);
        listaGuardadas.appendChild(fila);
    });
}

// ─── Eventos ───────────────────────────────────────────────────
selectCantidad.addEventListener('change', () => {
    estadoPaleta = [];
    renderizarPaleta();
});

boton.addEventListener('click', renderizarPaleta);
selectFormato.addEventListener('change', renderizarPaleta);
btnGuardar.addEventListener('click', guardarPaletaActual);
btnLimpiar.addEventListener('click', limpiarTodasLasPaletas);

// ─── Carga inicial ─────────────────────────────────────────────
renderizarPaleta();
renderizarPaletasGuardadas();