/**
 * algoritmos.js - Coordinador y Controlador de Visualización de Algoritmos
 * 
 * Responsabilidades:
 * - Conectar los algoritmos con la interfaz gráfica.
 * - Gestionar el bucle de animación paso a paso con velocidad configurable.
 * - Bloquear y desbloquear controles del jugador y botones durante la ejecución.
 * - Mostrar métricas en tiempo real (nodos explorados, camino encontrado).
 * - Proveer explicaciones pedagógicas claras y editables para cada algoritmo.
 */

// Diccionario de explicaciones educativas
const EXPLICACIONES_ALGORITMOS = {
    'BFS': {
        nombre: 'BFS (Breadth-First Search)',
        tag: 'Búsqueda en Anchura',
        descripcion: 'Explora primero los nodos más cercanos al inicio nivel por nivel. En un grafo sin pesos, encuentra de forma óptima el camino más corto.',
        puntos: [
            'Estructura: Cola FIFO (First In, First Out).',
            'Comportamiento: Se expande en forma de ondas concéntricas.',
            'Garantía: Camino más corto asegurado.',
            'Complejidad: O(V + E).'
        ]
    },
    'DFS': {
        nombre: 'DFS (Depth-First Search)',
        tag: 'Búsqueda en Profundidad',
        descripcion: 'Explora un camino lo más profundamente posible antes de retroceder (backtracking).',
        puntos: [
            'Estructura: Pila LIFO (Last In, First Out).',
            'Comportamiento: Se adentra en callejones hasta chocar con pared.',
            'Garantía: No garantiza el camino más corto.',
            'Uso pedagógico: Muestra una estrategia de exploración radicalmente opuesta a BFS.'
        ]
    },
    'Dijkstra': {
        nombre: 'Algoritmo de Dijkstra',
        tag: 'Camino Mínimo Voraz',
        descripcion: 'Busca siempre continuar desde el nodo conocido cuyo costo acumulado es menor.',
        puntos: [
            'Estructura: Cola de prioridad / Selección de costo mínimo.',
            'Comportamiento: Expande la frontera considerando el costo total desde el origen.',
            'Garantía: Óptimo en grafos con pesos no negativos.',
            'Ventaja: Base fundamental para sistemas con pesos variables de terreno.'
        ]
    },
    'Floyd-Warshall': {
        nombre: 'Algoritmo de Floyd-Warshall',
        tag: 'Programación Dinámica',
        descripcion: 'Calcula los caminos mínimos entre todos los pares de nodos utilizando programación dinámica.',
        puntos: [
            'Principio: Evalúa si un nodo intermedio K acorta la distancia entre cualquier par A y B.',
            'Ecuación: D[i][j] = min(D[i][j], D[i][k] + D[k][j]).',
            'Alcance: Resuelve todos los caminos a la vez (All-Pairs Shortest Path).',
            'Complejidad: O(V³) sobre los 452 nodos transitables.'
        ]
    }
};

// Controlador de estado del animador
const algoritmosController = {
    ejecutando: false,
    timerId: null,
    velocidadMs: 10,
    algoritmoActual: null,
    resultadoActual: null,
    pasoIndice: 0
};

/**
 * Ejecuta el algoritmo seleccionado y lanza la animación pedagógica.
 * @param {string} nombre - 'BFS' | 'DFS' | 'Dijkstra' | 'Floyd-Warshall'
 */
function ejecutarAlgoritmo(nombre) {
    // Si ya está corriendo, no iniciar otra animación en paralelo
    if (algoritmosController.ejecutando) {
        detenerAlgoritmo();
    }

    // Actualizar panel pedagógico
    actualizarPanelEducativo(nombre);

    // Ejecutar el cálculo del algoritmo (función pura)
    let resultado = null;
    switch (nombre) {
        case 'BFS':
            resultado = ejecutarBFS(laberinto, INICIO, META);
            break;
        case 'DFS':
            resultado = ejecutarDFS(laberinto, INICIO, META);
            break;
        case 'Dijkstra':
            resultado = ejecutarDijkstra(laberinto, INICIO, META);
            break;
        case 'Floyd-Warshall':
            resultado = ejecutarFloydWarshall(laberinto, INICIO, META);
            break;
        default:
            console.error('Algoritmo no reconocido:', nombre);
            return;
    }

    if (!resultado) return;

    algoritmosController.algoritmoActual = nombre;
    algoritmosController.resultadoActual = resultado;
    algoritmosController.pasoIndice = 0;
    algoritmosController.ejecutando = true;

    // Bloquear controles y botones de la interfaz
    bloquearInterfaz(true);
    actualizarEstadoUI(`Ejecutando ${nombre}...`, true);

    // Iniciar el bucle de animación
    animarPaso();
}

/**
 * Bucle paso a paso de la animación
 */
function animarPaso() {
    if (!algoritmosController.ejecutando) return;

    const { pasos, camino, visitadosTotal, longitudCamino } = algoritmosController.resultadoActual;
    
    if (algoritmosController.pasoIndice < pasos.length) {
        const paso = pasos[algoritmosController.pasoIndice];
        
        // Construir capas de superposición para el renderizado
        const overlays = {
            visitados: paso.visitadosSnapshot,
            frontera: paso.fronteraSnapshot,
            actual: paso.celda,
            camino: null
        };

        // Renderizar laberinto con las capas actuales
        renderizarLaberinto(overlays, null);

        // Actualizar métrica de nodos explorados en vivo
        const elCeldas = document.getElementById('algoCeldas');
        if (elCeldas && paso.visitadosSnapshot) {
            elCeldas.textContent = paso.visitadosSnapshot.size;
        }

        algoritmosController.pasoIndice++;
        algoritmosController.timerId = setTimeout(animarPaso, algoritmosController.velocidadMs);
    } else {
        // Animación de exploración terminada -> Mostrar el camino final encontrado
        animarCaminoFinal(camino, visitadosTotal, longitudCamino);
    }
}

/**
 * Animación del trazado del camino final
 */
function animarCaminoFinal(camino, visitadosTotal, longitudCamino) {
    let indiceCamino = 0;
    const caminoParcial = [];
    const visitados = algoritmosController.resultadoActual.pasos[algoritmosController.resultadoActual.pasos.length - 1]?.visitadosSnapshot || new Set();

    function dibujarPasoCamino() {
        if (!algoritmosController.ejecutando) return;

        if (indiceCamino < camino.length) {
            caminoParcial.push(camino[indiceCamino]);
            indiceCamino++;

            renderizarLaberinto({
                visitados: visitados,
                frontera: null,
                actual: null,
                camino: caminoParcial
            }, null);

            algoritmosController.timerId = setTimeout(dibujarPasoCamino, Math.max(15, algoritmosController.velocidadMs * 1.5));
        } else {
            // Demostración completamente finalizada con éxito
            finalizarAnimacion(visitadosTotal, longitudCamino);
        }
    }

    dibujarPasoCamino();
}

/**
 * Finaliza la animación y restaura controles
 */
function finalizarAnimacion(visitadosTotal, longitudCamino) {
    algoritmosController.ejecutando = false;
    bloquearInterfaz(false);
    
    // Actualizar métricas finales
    const elCeldas = document.getElementById('algoCeldas');
    const elLongitud = document.getElementById('algoLongitud');
    if (elCeldas) elCeldas.textContent = visitadosTotal;
    if (elLongitud) elLongitud.textContent = `${longitudCamino} pasos`;

    actualizarEstadoUI(`Demostración de ${algoritmosController.algoritmoActual} completada`, false);
}

/**
 * Detiene la animación en curso
 */
function detenerAlgoritmo() {
    if (algoritmosController.timerId) {
        clearTimeout(algoritmosController.timerId);
        algoritmosController.timerId = null;
    }
    algoritmosController.ejecutando = false;
    bloquearInterfaz(false);
    actualizarEstadoUI('Animación detenida', false);
}

/**
 * Limpia cualquier demostración activa y restaura la vista limpia del laberinto
 */
function limpiarDemostracion() {
    detenerAlgoritmo();
    algoritmosController.algoritmoActual = null;
    algoritmosController.resultadoActual = null;
    algoritmosController.pasoIndice = 0;

    const elCeldas = document.getElementById('algoCeldas');
    const elLongitud = document.getElementById('algoLongitud');
    if (elCeldas) elCeldas.textContent = '-';
    if (elLongitud) elLongitud.textContent = '-';

    actualizarEstadoUI('Listo para jugar', false);
    renderizarLaberinto({}, estadoJuego.posicionJugador);
}

/**
 * Cambia la velocidad de la animación
 */
function cambiarVelocidad(ms, etiqueta, botonElement) {
    algoritmosController.velocidadMs = ms;
    const label = document.getElementById('labelVelocidad');
    if (label) label.textContent = etiqueta;

    // Actualizar botón activo en la UI
    document.querySelectorAll('.speed-btn').forEach(btn => btn.classList.remove('active'));
    if (botonElement) botonElement.classList.add('active');
}

/**
 * Actualiza el panel educativo con la información del algoritmo seleccionado
 */
function actualizarPanelEducativo(nombre) {
    const info = EXPLICACIONES_ALGORITMOS[nombre];
    if (!info) return;

    const tag = document.getElementById('algoTag');
    const desc = document.getElementById('algoDesc');
    const bullets = document.getElementById('algoBullets');

    if (tag) tag.textContent = info.tag;
    if (desc) desc.textContent = info.descripcion;
    if (bullets) {
        bullets.innerHTML = info.puntos.map(p => `<li>${p}</li>`).join('');
    }

    // Resaltar botón activo
    document.querySelectorAll('#btnBFS, #btnDFS, #btnDijkstra, #btnFloydWarshall').forEach(b => b.classList.remove('active'));
    const btnMap = {
        'BFS': 'btnBFS',
        'DFS': 'btnDFS',
        'Dijkstra': 'btnDijkstra',
        'Floyd-Warshall': 'btnFloydWarshall'
    };
    const elBtn = document.getElementById(btnMap[nombre] || `btn${nombre}`);
    if (elBtn) elBtn.classList.add('active');
}

/**
 * Bloquea o desbloquea botones y controles de teclado durante la ejecución
 */
function bloquearInterfaz(bloquear) {
    // Bloquear jugador
    bloquearControlesJugador(bloquear);

    // Botones de algoritmos
    const botones = ['btnBFS', 'btnDFS', 'btnDijkstra', 'btnFloydWarshall', 'btnReiniciarJuego'];
    for (const id of botones) {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = bloquear;
    }

    // Botón de detener
    const btnDetener = document.getElementById('btnDetener');
    if (btnDetener) btnDetener.disabled = !bloquear;
}

/**
 * Actualiza el texto y punto indicador de la barra de estado
 */
function actualizarEstadoUI(texto, ocupado) {
    const elTexto = document.getElementById('statusText');
    const elDot = document.getElementById('statusIndicator');

    if (elTexto) elTexto.textContent = texto;
    if (elDot) {
        if (ocupado) elDot.classList.add('busy');
        else elDot.classList.remove('busy');
    }
}

// Exportar globalmente
window.algoritmosController = algoritmosController;
window.ejecutarAlgoritmo = ejecutarAlgoritmo;
window.detenerAlgoritmo = detenerAlgoritmo;
window.limpiarDemostracion = limpiarDemostracion;
window.cambiarVelocidad = cambiarVelocidad;
window.actualizarPanelEducativo = actualizarPanelEducativo;
