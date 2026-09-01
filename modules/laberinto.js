/**
 * Archivo de compatibilidad con la estructura previa.
 * Carga el módulo principal desde js/laberinto.js
 */
if (typeof window !== 'undefined' && !window.laberinto) {
    // Si no está cargado globalmente, asegurar disponibilidad
    console.info('Cargando laberinto desde js/laberinto.js...');
}