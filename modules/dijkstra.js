/**
 * Archivo de compatibilidad con la estructura previa.
 * La implementación oficial de Dijkstra se encuentra modularizada en js/dijkstra.js
 */
if (typeof window !== 'undefined' && !window.ejecutarDijkstra) {
    console.info('Dijkstra modularizado disponible en js/dijkstra.js');
}
