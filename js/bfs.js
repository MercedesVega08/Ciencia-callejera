/**
 * bfs.js - Breadth-First Search (Búsqueda en Anchura)
 * 
 * Concepto Educativo:
 * - Utiliza una estructura de datos COLA (FIFO: Primero en entrar, primero en salir).
 * - Explora el laberinto por "ondas" concéntricas (nivel por nivel).
 * - En grafos no ponderados (o donde cada paso cuesta 1), GARANTIZA encontrar el camino más corto.
 * 
 * @param {Array<Array<number>>} matrizLaberinto - Matriz 31x31 (1 pared, 0 camino).
 * @param {{fila: number, columna: number}} inicio - Coordenadas de inicio.
 * @param {{fila: number, columna: number}} meta - Coordenadas de la meta.
 * @returns {{ pasos: Array<Object>, camino: Array<Object>, visitadosTotal: number, exito: boolean }}
 */
function ejecutarBFS(matrizLaberinto, inicio, meta) {
    const filas = matrizLaberinto.length;
    const columnas = matrizLaberinto[0].length;
    
    // Cola FIFO para almacenar los nodos por explorar
    const cola = [];
    
    // Conjuntos para rastrear celdas visitadas y celdas en cola
    const visitados = new Set();
    const enCola = new Set();
    
    // Mapa para reconstruir el camino: clave 'r,c' -> { fila, columna } previo
    const predecesores = new Map();
    
    // Lista ordenada de pasos para la animación pedagógica
    const pasosAnimacion = [];
    
    // Clave string para coordenadas
    const clave = (f, c) => `${f},${c}`;
    
    // Inicializar con el nodo de partida
    cola.push({ fila: inicio.fila, columna: inicio.columna });
    enCola.add(clave(inicio.fila, inicio.columna));
    
    // Direcciones de movimiento ortogonal: Arriba, Abajo, Izquierda, Derecha
    const direcciones = [
        { df: -1, dc: 0, nombre: 'Arriba' },
        { df: 1, dc: 0, nombre: 'Abajo' },
        { df: 0, dc: -1, nombre: 'Izquierda' },
        { df: 0, dc: 1, nombre: 'Derecha' }
    ];
    
    let metaAlcanzada = false;
    
    while (cola.length > 0) {
        // Desencolar el elemento más antiguo (FIFO)
        const actual = cola.shift();
        const claveActual = clave(actual.fila, actual.columna);
        
        // Marcar como visitado
        visitados.add(claveActual);
        
        // Registrar paso de visita para animación
        pasosAnimacion.push({
            tipo: 'visita',
            celda: { fila: actual.fila, columna: actual.columna },
            visitadosSnapshot: new Set(visitados),
            fronteraSnapshot: new Set(enCola)
        });
        
        // Comprobar si hemos llegado a la meta
        if (actual.fila === meta.fila && actual.columna === meta.columna) {
            metaAlcanzada = true;
            break;
        }
        
        // Explorar vecinos inmediatos
        for (const dir of direcciones) {
            const nf = actual.fila + dir.df;
            const nc = actual.columna + dir.dc;
            const claveVecino = clave(nf, nc);
            
            // Validar límites y que sea camino (0)
            if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas && matrizLaberinto[nf][nc] === 0) {
                if (!visitados.has(claveVecino) && !enCola.has(claveVecino)) {
                    enCola.add(claveVecino);
                    predecesores.set(claveVecino, actual);
                    cola.push({ fila: nf, columna: nc });
                    
                    // Registrar nuevo nodo descubierto en la frontera
                    pasosAnimacion.push({
                        tipo: 'frontera',
                        celda: { fila: nf, columna: nc },
                        visitadosSnapshot: new Set(visitados),
                        fronteraSnapshot: new Set(enCola)
                    });
                }
            }
        }
    }
    
    // Reconstruir el camino óptimo desde la meta hacia el inicio
    const caminoFinal = [];
    if (metaAlcanzada) {
        let actual = meta;
        while (actual) {
            caminoFinal.unshift(actual);
            const claveActual = clave(actual.fila, actual.columna);
            if (actual.fila === inicio.fila && actual.columna === inicio.columna) {
                break;
            }
            actual = predecesores.get(claveActual);
        }
    }
    
    return {
        algoritmo: 'BFS',
        pasos: pasosAnimacion,
        camino: caminoFinal,
        visitadosTotal: visitados.size,
        longitudCamino: caminoFinal.length > 0 ? caminoFinal.length - 1 : 0,
        exito: metaAlcanzada
    };
}

// Exportar globalmente
window.ejecutarBFS = ejecutarBFS;
