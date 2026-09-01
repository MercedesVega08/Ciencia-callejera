/**
 * laberinto.js
 * 
 * Responsabilidades:
 * - Definición de la matriz original del laberinto (31x31).
 * - Configuración del Canvas.
 * - Dibujado de paredes, caminos, inicio, meta y jugador.
 * - Capas de renderizado visual para algoritmos (visitas, frontera, camino final).
 * - Funciones de utilidad de la cuadrícula (vecinos, transitabilidad).
 */

// Configuración de la cuadrícula
const TAMANO_CELDA = 25; // Cada celda mide 25px x 25px

// Coordenadas fijas de inicio y meta (aberturas en el marco exterior)
const INICIO = { fila: 27, columna: 0 };
const META = { fila: 3, columna: 30 };

// Matriz original de 31x31 (1 = Pared, 0 = Camino)
const laberinto = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],    
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Elementos del Canvas
let canvas = null;
let ctx = null;

// Inicialización del Canvas
function inicializarCanvas(canvasElement) {
    canvas = canvasElement || document.getElementById('canvasLaberinto');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // Dimensionar según la matriz
    canvas.width = laberinto[0].length * TAMANO_CELDA;
    canvas.height = laberinto.length * TAMANO_CELDA;
}

// Comprueba si una coordenada está dentro de límites y es camino (0)
function esTransitable(fila, columna) {
    if (fila < 0 || fila >= laberinto.length) return false;
    if (columna < 0 || columna >= laberinto[0].length) return false;
    return laberinto[fila][columna] === 0;
}

// Obtiene los vecinos transitables en orden [Arriba, Abajo, Izquierda, Derecha]
function obtenerVecinos(fila, columna) {
    const movimientos = [
        { df: -1, dc: 0, nombre: 'Arriba' },
        { df: 1, dc: 0, nombre: 'Abajo' },
        { df: 0, dc: -1, nombre: 'Izquierda' },
        { df: 0, dc: 1, nombre: 'Derecha' }
    ];
    
    const vecinos = [];
    for (const mov of movimientos) {
        const nf = fila + mov.df;
        const nc = columna + mov.dc;
        if (esTransitable(nf, nc)) {
            vecinos.push({ fila: nf, columna: nc });
        }
    }
    return vecinos;
}

// Dibujo de primitivas individuales
function dibujarPared(r, c) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(c * TAMANO_CELDA, r * TAMANO_CELDA, TAMANO_CELDA, TAMANO_CELDA);
    
    // Borde sutil para darle relieve y textura a las paredes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.strokeRect(c * TAMANO_CELDA + 0.5, r * TAMANO_CELDA + 0.5, TAMANO_CELDA - 1, TAMANO_CELDA - 1);
}

function dibujarCamino(r, c) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(c * TAMANO_CELDA, r * TAMANO_CELDA, TAMANO_CELDA, TAMANO_CELDA);
    
    // Cuadrícula sutil
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(c * TAMANO_CELDA, r * TAMANO_CELDA, TAMANO_CELDA, TAMANO_CELDA);
}

function dibujarInicio(r, c) {
    // Fondo de inicio
    ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.fillRect(c * TAMANO_CELDA, r * TAMANO_CELDA, TAMANO_CELDA, TAMANO_CELDA);
    
    // Icono / Marca de inicio
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(
        c * TAMANO_CELDA + TAMANO_CELDA / 2, 
        r * TAMANO_CELDA + TAMANO_CELDA / 2, 
        TAMANO_CELDA / 3.2, 
        0, 
        Math.PI * 2
    );
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
}

function dibujarMeta(r, c) {
    // Fondo de meta
    ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.fillRect(c * TAMANO_CELDA, r * TAMANO_CELDA, TAMANO_CELDA, TAMANO_CELDA);
    
    // Icono / Marca de meta (Corona / Cuadrado dorado rotado)
    ctx.fillStyle = '#f59e0b';
    const cx = c * TAMANO_CELDA + TAMANO_CELDA / 2;
    const cy = r * TAMANO_CELDA + TAMANO_CELDA / 2;
    const radio = TAMANO_CELDA / 3;
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-radio / 1.2, -radio / 1.2, radio * 1.6, radio * 1.6);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-radio / 1.2, -radio / 1.2, radio * 1.6, radio * 1.6);
    ctx.restore();
}

function dibujarJugador(r, c) {
    const cx = c * TAMANO_CELDA + TAMANO_CELDA / 2;
    const cy = r * TAMANO_CELDA + TAMANO_CELDA / 2;
    const radio = TAMANO_CELDA / 2.6;

    // Resplandor exterior suave
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.beginPath();
    ctx.arc(cx, cy, radio + 3, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo del jugador
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(cx, cy, radio, 0, Math.PI * 2);
    ctx.fill();

    // Borde blanco nítido
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ojos del jugador (dirección amigable)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 2, 2, 0, Math.PI * 2);
    ctx.arc(cx + 3, cy - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 2, 1, 0, Math.PI * 2);
    ctx.arc(cx + 3, cy - 2, 1, 0, Math.PI * 2);
    ctx.fill();
}

// Dibujo de celdas según capas de visualización de algoritmos
function dibujarOverlay(overlays = {}) {
    // 1. Celdas visitadas / exploradas
    if (overlays.visitados) {
        for (const clave of overlays.visitados) {
            const [r, c] = clave.split(',').map(Number);
            // No tapar inicio ni meta completamente
            if ((r === INICIO.fila && c === INICIO.columna) || (r === META.fila && c === META.columna)) continue;
            
            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)'; // Azul cielo translúcido
            ctx.fillRect(c * TAMANO_CELDA, r * TAMANO_CELDA, TAMANO_CELDA, TAMANO_CELDA);
        }
    }

    // 2. Celdas en la frontera / cola / pila
    if (overlays.frontera) {
        for (const clave of overlays.frontera) {
            const [r, c] = clave.split(',').map(Number);
            if ((r === INICIO.fila && c === INICIO.columna) || (r === META.fila && c === META.columna)) continue;
            
            ctx.fillStyle = 'rgba(168, 85, 247, 0.55)'; // Violeta
            ctx.fillRect(c * TAMANO_CELDA, r * TAMANO_CELDA, TAMANO_CELDA, TAMANO_CELDA);
        }
    }

    // 3. Celda actualmente procesada
    if (overlays.actual) {
        const { fila: r, columna: c } = overlays.actual;
        ctx.fillStyle = '#fbbf24'; // Amarillo ámbar activo
        ctx.fillRect(c * TAMANO_CELDA + 2, r * TAMANO_CELDA + 2, TAMANO_CELDA - 4, TAMANO_CELDA - 4);
    }

    // 4. Camino final encontrado
    if (overlays.camino && overlays.camino.length > 0) {
        for (let i = 0; i < overlays.camino.length; i++) {
            const { fila: r, columna: c } = overlays.camino[i];
            
            ctx.fillStyle = 'rgba(34, 197, 94, 0.85)'; // Verde esmeralda brillante
            ctx.fillRect(c * TAMANO_CELDA + 3, r * TAMANO_CELDA + 3, TAMANO_CELDA - 6, TAMANO_CELDA - 6);
        }

        // Trazar línea continua conectando el camino
        if (overlays.camino.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = '#15803d';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            for (let i = 0; i < overlays.camino.length; i++) {
                const { fila: r, columna: c } = overlays.camino[i];
                const cx = c * TAMANO_CELDA + TAMANO_CELDA / 2;
                const cy = r * TAMANO_CELDA + TAMANO_CELDA / 2;
                if (i === 0) ctx.moveTo(cx, cy);
                else ctx.lineTo(cx, cy);
            }
            ctx.stroke();
        }
    }
}

/**
 * Renderizado completo del laberinto respetando todas las capas.
 * @param {Object} overlays - Capas opcionales de algoritmos (visitados, frontera, actual, camino).
 * @param {Object|null} jugador - Posición opcional del jugador { fila, columna }.
 */
function renderizarLaberinto(overlays = {}, jugador = null) {
    if (!ctx) return;

    // 1. Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Dibujar estructura base (paredes y caminos)
    for (let r = 0; r < laberinto.length; r++) {
        for (let c = 0; c < laberinto[0].length; c++) {
            if (laberinto[r][c] === 1) {
                dibujarPared(r, c);
            } else {
                dibujarCamino(r, c);
            }
        }
    }

    // 3. Dibujar capas de algoritmos (si existen)
    dibujarOverlay(overlays);

    // 4. Dibujar puntos de Inicio y Meta
    dibujarInicio(INICIO.fila, INICIO.columna);
    dibujarMeta(META.fila, META.columna);

    // 5. Dibujar Jugador si está presente
    if (jugador) {
        dibujarJugador(jugador.fila, jugador.columna);
    }
}

// Exportar funciones y constantes para uso global / modular
window.TAMANO_CELDA = TAMANO_CELDA;
window.INICIO = INICIO;
window.META = META;
window.laberinto = laberinto;
window.inicializarCanvas = inicializarCanvas;
window.esTransitable = esTransitable;
window.obtenerVecinos = obtenerVecinos;
window.renderizarLaberinto = renderizarLaberinto;
