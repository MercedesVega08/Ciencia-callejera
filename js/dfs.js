/**
 * dfs.js - Depth-First Search (Búsqueda en Profundidad)
 * 
 * Concepto Educativo:
 * - Utiliza una estructura de datos PILA (LIFO: Último en entrar, primero en salir).
 * - Avanza por una rama lo más profundo posible hasta topar con pared, y luego retrocede (backtracking).
 * - A diferencia de BFS, NO garantiza encontrar el camino más corto, pero suele usar menos memoria en ciertos grafos.
 * 
 * @param {Array<Array<number>>} matrizLaberinto - Matriz 31x31 (1 pared, 0 camino).
 * @param {{fila: number, columna: number}} inicio - Coordenadas de inicio.
 * @param {{fila: number, columna: number}} meta - Coordenadas de la meta.
 * @returns {{ pasos: Array<Object>, camino: Array<Object>, visitadosTotal: number, exito: boolean }}
 */
function ejecutarDFS(matrizLaberinto, inicio, meta) {
    const filas = matrizLaberinto.length;
    const columnas = matrizLaberinto[0].length;
    
    // Pila LIFO explícita para nodos por explorar
    const pila = [];
    
    // Conjuntos para rastrear nodos
    const visitados = new Set();
    const enPila = new Set();
    
    // Mapa de predecesores para reconstruir la ruta
    const predecesores = new Map();
    
    // Lista ordenada de pasos para animación
    const pasosAnimacion = [];
    
    const clave = (f, c) => `${f},${c}`;
    
    // Inicializar con el nodo de partida
    pila.push({ fila: inicio.fila, columna: inicio.columna });
    enPila.add(clave(inicio.fila, inicio.columna));
    
    // Orden de exploración: Derecha, Abajo, Izquierda, Arriba (o configurable)
    const direcciones = [
        { df: 0, dc: 1, nombre: 'Derecha' },
        { df: 1, dc: 0, nombre: 'Abajo' },
        { df: 0, dc: -1, nombre: 'Izquierda' },
        { df: -1, dc: 0, nombre: 'Arriba' }
    ];
    
    let metaAlcanzada = false;
    
    while (pila.length > 0) {
        // Desapilar el último elemento agregado (LIFO)
        const actual = pila.pop();
        const claveActual = clave(actual.fila, actual.columna);
        enPila.delete(claveActual);
        
        // Si ya fue visitado en otra rama, continuar
        if (visitados.has(claveActual)) continue;
        
        visitados.add(claveActual);
        
        pasosAnimacion.push({
            tipo: 'visita',
            celda: { fila: actual.fila, columna: actual.columna },
            visitadosSnapshot: new Set(visitados),
            fronteraSnapshot: new Set(enPila)
        });
        
        if (actual.fila === meta.fila && actual.columna === meta.columna) {
            metaAlcanzada = true;
            break;
        }
        
        // Agregar vecinos no visitados a la pila
        for (const dir of direcciones) {
            const nf = actual.fila + dir.df;
            const nc = actual.columna + dir.dc;
            const claveVecino = clave(nf, nc);
            
            if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas && matrizLaberinto[nf][nc] === 0) {
                if (!visitados.has(claveVecino)) {
                    predecesores.set(claveVecino, actual);
                    pila.push({ fila: nf, columna: nc });
                    enPila.add(claveVecino);
                    
                    pasosAnimacion.push({
                        tipo: 'frontera',
                        celda: { fila: nf, columna: nc },
                        visitadosSnapshot: new Set(visitados),
                        fronteraSnapshot: new Set(enPila)
                    });
                }
            }
        }
    }
    
    // Reconstruir camino
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
        algoritmo: 'DFS',
        pasos: pasosAnimacion,
        camino: caminoFinal,
        visitadosTotal: visitados.size,
        longitudCamino: caminoFinal.length > 0 ? caminoFinal.length - 1 : 0,
        exito: metaAlcanzada
    };
}

// Exportar globalmente
window.ejecutarDFS = ejecutarDFS;
