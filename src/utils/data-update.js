// src/utils/data-update.js
import { fetchGoogleSheetData } from './google-sheets.js';  // Cambié la ruta
import fs from 'fs';
import path from 'path';

async function updatePublicacionesJSON() {
  try {
    // Obtener los datos de Google Sheets
    const { publicaciones } = await fetchGoogleSheetData();

    // Mapear los datos a un formato adecuado para publicaciones.json
    const publicacionesData = publicaciones.map(row => ({
      titulo: row[0], // Título de la publicación (columna A)
      url: row[1],    // URL de la publicación (columna B)
    }));

    // Ruta al archivo publicaciones.json dentro de public/data
    const publicacionesPath = path.resolve('../../public/data/publicaciones.json');

    // Escribir el nuevo contenido en el archivo publicaciones.json
    fs.writeFileSync(publicacionesPath, JSON.stringify(publicacionesData, null, 2));

    console.log('publicaciones.json actualizado correctamente.');
  } catch (error) {
    console.error('Error al actualizar publicaciones.json:', error);
  }
}

// Ejecutar la función
updatePublicacionesJSON();
