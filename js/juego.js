/**
 * juego.js
 * 
 * Responsabilidades:
 * - Control interactivo del jugador mediante teclado (Flechas y WASD).
 * - Validación estricta de movimientos celda por celda según la matriz.
 * - Gestión del estado de la partida (pasos, tiempo, victoria).
 * - Detección de meta y visualización de victoria.
 * - Reinicio y control de bloqueo de entrada.
 */

// Estado del juego
const estadoJuego = {
    posicionJugador: { fila: 27, columna: 0 },
    juegoActivo: true,
    bloqueado: false, // Bloqueo durante algoritmos
    haGanado: false,
    pasos: 0,
    tiempoInicio: null,
    tiempoTranscurrido: 0,
    intervaloTiempo: null
};

// Inicialización del juego
function inicializarJuego() {
    estadoJuego.posicionJugador = { fila: INICIO.fila, columna: INICIO.columna };
    estadoJuego.juegoActivo = true;
    estadoJuego.bloqueado = false;
    estadoJuego.haGanado = false;
    estadoJuego.pasos = 0;
    estadoJuego.tiempoTranscurrido = 0;
    
    if (estadoJuego.intervaloTiempo) {
        clearInterval(estadoJuego.intervaloTiempo);
        estadoJuego.intervaloTiempo = null;
    }
    
    actualizarMarcadoresUI();
    ocultarOverlayVictoria();
    renderizarLaberinto({}, estadoJuego.posicionJugador);
    configurarEventosTeclado();
}

// Configuración de escuchadores del teclado
let eventosConfigurados = false;
function configurarEventosTeclado() {
    if (eventosConfigurados) return;
    
    window.addEventListener('keydown', (e) => {
        if (!estadoJuego.juegoActivo || estadoJuego.bloqueado || estadoJuego.haGanado) {
            return;
        }

        let deltaFila = 0;
        let deltaCol = 0;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                deltaFila = -1;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                deltaFila = 1;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                deltaCol = -1;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                deltaCol = 1;
                break;
            default:
                return; // Ignorar otras teclas
        }

        // Evitar el desplazamiento de la página por las teclas de flecha
        e.preventDefault();
        
        intentarMoverJugador(deltaFila, deltaCol);
    });

    eventosConfigurados = true;
}

// Validación y ejecución del movimiento
function intentarMoverJugador(deltaFila, deltaCol) {
    const nuevaFila = estadoJuego.posicionJugador.fila + deltaFila;
    const nuevaCol = estadoJuego.posicionJugador.columna + deltaCol;

    // Validación celda a celda: únicamente celdas transitables (valor 0)
    if (esTransitable(nuevaFila, nuevaCol)) {
        // Iniciar temporizador con el primer movimiento
        if (estadoJuego.pasos === 0 && !estadoJuego.intervaloTiempo) {
            estadoJuego.tiempoInicio = Date.now();
            estadoJuego.intervaloTiempo = setInterval(() => {
                estadoJuego.tiempoTranscurrido = Math.floor((Date.now() - estadoJuego.tiempoInicio) / 1000);
                actualizarMarcadoresUI();
            }, 1000);
        }

        estadoJuego.posicionJugador = { fila: nuevaFila, columna: nuevaCol };
        estadoJuego.pasos++;
        actualizarMarcadoresUI();

        // Redibujar con la nueva posición
        renderizarLaberinto({}, estadoJuego.posicionJugador);

        // Verificar condición de victoria
        verificarVictoria();
    }
}

// Verificación de llegada a la meta
function verificarVictoria() {
    if (estadoJuego.posicionJugador.fila === META.fila && estadoJuego.posicionJugador.columna === META.columna) {
        estadoJuego.haGanado = true;
        if (estadoJuego.intervaloTiempo) {
            clearInterval(estadoJuego.intervaloTiempo);
            estadoJuego.intervaloTiempo = null;
        }

        mostrarOverlayVictoria();
    }
}

// Mostrar overlay de felicitaciones
function mostrarOverlayVictoria() {
    const overlay = document.getElementById('victoryOverlay');
    const statPasos = document.getElementById('victoryPasos');
    const statTiempo = document.getElementById('victoryTiempo');

    if (statPasos) statPasos.textContent = estadoJuego.pasos;
    if (statTiempo) statTiempo.textContent = `${estadoJuego.tiempoTranscurrido}s`;
    if (overlay) overlay.classList.remove('hidden');
}

// Ocultar overlay
function ocultarOverlayVictoria() {
    const overlay = document.getElementById('victoryOverlay');
    if (overlay) overlay.classList.add('hidden');
}

// Actualizar contadores en la interfaz
function actualizarMarcadoresUI() {
    const elPasos = document.getElementById('marcadorPasos');
    const elTiempo = document.getElementById('marcadorTiempo');
    const elPos = document.getElementById('marcadorPosicion');

    if (elPasos) elPasos.textContent = estadoJuego.pasos;
    if (elTiempo) elTiempo.textContent = `${estadoJuego.tiempoTranscurrido}s`;
    if (elPos) elPos.textContent = `(${estadoJuego.posicionJugador.fila}, ${estadoJuego.posicionJugador.columna})`;
}

// Reiniciar la partida y devolver al jugador al inicio
function reiniciarJuego() {
    // Si hay un algoritmo corriendo, lo detenemos desde algoritmos.js si está cargado
    if (window.algoritmosController && typeof window.algoritmosController.detener === 'function') {
        window.algoritmosController.detener();
    }

    inicializarJuego();
}

// Bloquear / Desbloquear controles del jugador
function bloquearControlesJugador(bloquear) {
    estadoJuego.bloqueado = bloquear;
}

// Exportar funciones y estado
window.estadoJuego = estadoJuego;
window.inicializarJuego = inicializarJuego;
window.reiniciarJuego = reiniciarJuego;
window.bloquearControlesJugador = bloquearControlesJugador;
