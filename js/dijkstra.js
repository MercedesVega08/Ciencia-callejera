/**
 * dijkstra.js - Algoritmo de Dijkstra
 * 
 * Concepto Educativo:
 * - Algoritmo voraz (Greedy) para caminos mínimos en grafos con pesos no negativos.
 * - Mantiene una tabla de "distancia mínima conocida desde el origen" a cada celda.
 * - En cada paso, selecciona el nodo no visitado con MENOR costo acumulado.
 * - En este laberinto (aristas con costo unitario = 1), coincide en resultado óptimo con BFS,
 *   pero sienta las bases para cuando diferentes terrenos tengan costos distintos.
 * 
 * @param {Array<Array<number>>} matrizLaberinto - Matriz 31x31 (1 pared, 0 camino).
 * @param {{fila: number, columna: number}} inicio - Coordenadas de inicio.
 * @param {{fila: number, columna: number}} meta - Coordenadas de la meta.
 * @returns {{ pasos: Array<Object>, camino: Array<Object>, visitadosTotal: number, costoTotal: number, exito: boolean }}
 */
function ejecutarDijkstra(matrizLaberinto, inicio, meta) {
    const filas = matrizLaberinto.length;
    const columnas = matrizLaberinto[0].length;
    
    const clave = (f, c) => `${f},${c}`;
    
    // Tabla de distancias mínimas conocidas (costo acumulado)
    const distancias = new Map();
    
    // Mapa de predecesores para reconstruir la ruta
    const predecesores = new Map();
    
    // Conjunto de visitados definitivos
    const visitados = new Set();
    
    // Conjunto de nodos descubiertos en la frontera activa con su costo
    // Map de 'r,c' -> costo
    const frontera = new Map();
    
    // Pasos pedagógicos para la animación
    const pasosAnimacion = [];
    
    // Inicializar punto de partida con costo 0
    const claveInicio = clave(inicio.fila, inicio.columna);
    distancias.set(claveInicio, 0);
    frontera.set(claveInicio, 0);
    
    const direcciones = [
        { df: -1, dc: 0, nombre: 'Arriba' },
        { df: 1, dc: 0, nombre: 'Abajo' },
        { df: 0, dc: -1, nombre: 'Izquierda' },
        { df: 0, dc: 1, nombre: 'Derecha' }
    ];
    
    let metaAlcanzada = false;
    
    while (frontera.size > 0) {
        // Encontrar el nodo en la frontera con el menor costo acumulado
        let menorClave = null;
        let menorDist = Infinity;
        
        for (const [k, d] of frontera.entries()) {
            if (d < menorDist) {
                menorDist = d;
                menorClave = k;
            }
        }
        
        if (!menorClave || menorDist === Infinity) break;
        
        // Extraer el nodo con menor costo
        frontera.delete(menorClave);
        visitados.add(menorClave);
        
        const [r, c] = menorClave.split(',').map(Number);
        
        pasosAnimacion.push({
            tipo: 'visita',
            celda: { fila: r, columna: c },
            costoActual: menorDist,
            visitadosSnapshot: new Set(visitados),
            fronteraSnapshot: new Set(frontera.keys())
        });
        
        // Comprobar si llegamos a la meta
        if (r === meta.fila && c === meta.columna) {
            metaAlcanzada = true;
            break;
        }
        
        // Relajar aristas hacia los vecinos transitables (costo = 1 por paso)
        for (const dir of direcciones) {
            const nf = r + dir.df;
            const nc = c + dir.dc;
            const claveVecino = clave(nf, nc);
            
            if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas && matrizLaberinto[nf][nc] === 0) {
                if (!visitados.has(claveVecino)) {
                    const nuevoCosto = menorDist + 1;
                    const costoAnterior = distancias.has(claveVecino) ? distancias.get(claveVecino) : Infinity;
                    
                    if (nuevoCosto < costoAnterior) {
                        distancias.set(claveVecino, nuevoCosto);
                        predecesores.set(claveVecino, { fila: r, columna: c });
                        frontera.set(claveVecino, nuevoCosto);
                        
                        pasosAnimacion.push({
                            tipo: 'frontera',
                            celda: { fila: nf, columna: nc },
                            costo: nuevoCosto,
                            visitadosSnapshot: new Set(visitados),
                            fronteraSnapshot: new Set(frontera.keys())
                        });
                    }
                }
            }
        }
    }
    
    // Reconstruir camino óptimo
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
    
    const costoFinal = distancias.get(clave(meta.fila, meta.columna)) || 0;
    
    return {
        algoritmo: 'Dijkstra',
        pasos: pasosAnimacion,
        camino: caminoFinal,
        visitadosTotal: visitados.size,
        costoTotal: costoFinal,
        longitudCamino: caminoFinal.length > 0 ? caminoFinal.length - 1 : 0,
        exito: metaAlcanzada
    };
}

// Exportar globalmente
window.ejecutarDijkstra = ejecutarDijkstra;
