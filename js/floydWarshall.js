/**
 * floydWarshall.js - Algoritmo de Floyd-Warshall (Caminos Mínimos entre Todos los Pares)
 * 
 * Concepto Educativo:
 * - Algoritmo de PROGRAMACIÓN DINÁMICA.
 * - Calcula la distancia más corta entre CUALQUIER par de nodos (A y B) simultáneamente.
 * - Pregunta clave en cada paso: "¿Es más corto ir de A a B pasando por el nodo intermedio K?"
 *   Ecuación: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
 * - Como el laberinto tiene 452 celdas transitables, construimos el grafo de nodos transitables
 *   y mostramos pedagógicamente cómo la evaluación de nodos intermedios 'K' conecta todo el mapa.
 * 
 * @param {Array<Array<number>>} matrizLaberinto - Matriz 31x31 (1 pared, 0 camino).
 * @param {{fila: number, columna: number}} inicio - Coordenadas de inicio.
 * @param {{fila: number, columna: number}} meta - Coordenadas de la meta.
 * @returns {{ pasos: Array<Object>, camino: Array<Object>, visitadosTotal: number, exito: boolean, explicacionK: string }}
 */
function ejecutarFloydWarshall(matrizLaberinto, inicio, meta) {
    const filas = matrizLaberinto.length;
    const columnas = matrizLaberinto[0].length;
    
    // 1. Identificar todas las celdas transitables (nodos del grafo)
    const nodosTransitables = [];
    const coordAIndice = new Map();
    const clave = (f, c) => `${f},${c}`;
    
    for (let r = 0; r < filas; r++) {
        for (let c = 0; c < columnas; c++) {
            if (matrizLaberinto[r][c] === 0) {
                const idx = nodosTransitables.length;
                nodosTransitables.push({ fila: r, columna: c });
                coordAIndice.set(clave(r, c), idx);
            }
        }
    }
    
    const N = nodosTransitables.length; // 452 nodos transitables
    const idxInicio = coordAIndice.get(clave(inicio.fila, inicio.columna));
    const idxMeta = coordAIndice.get(clave(meta.fila, meta.columna));
    
    // 2. Construir matrices de adyacencia (distancias directas y siguiente nodo para reconstrucción)
    // Para optimizar memoria y tiempo en el navegador:
    // dist[i * N + j] y next[i * N + j]
    const dist = new Float32Array(N * N).fill(Infinity);
    const next = new Int16Array(N * N).fill(-1);
    
    // Distancia de un nodo a sí mismo es 0
    for (let i = 0; i < N; i++) {
        dist[i * N + i] = 0;
        next[i * N + i] = i;
    }
    
    // Conectar vecinos directos (costo = 1)
    const direcciones = [
        { df: -1, dc: 0 },
        { df: 1, dc: 0 },
        { df: 0, dc: -1 },
        { df: 0, dc: 1 }
    ];
    
    for (let i = 0; i < N; i++) {
        const u = nodosTransitables[i];
        for (const dir of direcciones) {
            const nf = u.fila + dir.df;
            const nc = u.columna + dir.dc;
            const claveVecino = clave(nf, nc);
            if (coordAIndice.has(claveVecino)) {
                const j = coordAIndice.get(claveVecino);
                dist[i * N + j] = 1;
                next[i * N + j] = j;
            }
        }
    }
    
    // 3. Ejecutar Programación Dinámica de Floyd-Warshall con muestreo pedagógico de pasos
    // Seleccionamos un conjunto de nodos intermedios K representativos para visualizar la propagación
    const pasosAnimacion = [];
    const visitadosSet = new Set();
    
    // Realizar la iteración completa de Floyd-Warshall
    for (let k = 0; k < N; k++) {
        const nodoK = nodosTransitables[k];
        const claveK = clave(nodoK.fila, nodoK.columna);
        visitadosSet.add(claveK);
        
        let mejorasConK = 0;
        
        for (let i = 0; i < N; i++) {
            const distIK = dist[i * N + k];
            if (distIK === Infinity) continue;
            
            for (let j = 0; j < N; j++) {
                const distKJ = dist[k * N + j];
                if (distKJ === Infinity) continue;
                
                const nuevaDist = distIK + distKJ;
                if (nuevaDist < dist[i * N + j]) {
                    dist[i * N + j] = nuevaDist;
                    next[i * N + j] = next[i * N + k];
                    mejorasConK++;
                }
            }
        }
        
        // Registrar paso pedagógico periódicamente para mostrar la evolución del cálculo
        if (k % 3 === 0 || k === idxInicio || k === idxMeta || k === N - 1) {
            pasosAnimacion.push({
                tipo: 'visita',
                celda: nodoK,
                nodoK: nodoK,
                indiceK: k,
                totalNodos: N,
                mejoras: mejorasConK,
                visitadosSnapshot: new Set(visitadosSet),
                fronteraSnapshot: new Set([claveK])
            });
        }
    }
    
    // 4. Reconstruir el camino óptimo entre Inicio y Meta utilizando la matriz 'next'
    const caminoFinal = [];
    if (dist[idxInicio * N + idxMeta] !== Infinity) {
        let u = idxInicio;
        while (u !== idxMeta) {
            caminoFinal.push(nodosTransitables[u]);
            u = next[u * N + idxMeta];
            if (u === -1 || caminoFinal.length > N) break; // Salvaguarda contra ciclos
        }
        caminoFinal.push(nodosTransitables[idxMeta]);
    }
    
    return {
        algoritmo: 'Floyd-Warshall',
        pasos: pasosAnimacion,
        camino: caminoFinal,
        visitadosTotal: N,
        totalParesCalculados: N * N,
        longitudCamino: caminoFinal.length > 0 ? caminoFinal.length - 1 : 0,
        exito: caminoFinal.length > 0
    };
}

// Exportar globalmente
window.ejecutarFloydWarshall = ejecutarFloydWarshall;
