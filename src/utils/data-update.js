import { fetchGoogleSheetData } from './google-sheets.js';
import fs from 'fs';
import path from 'path';

async function updateDataJSON() {
  try {
    // Obtener los datos de Google Sheets
    const { publicaciones, novedades } = await fetchGoogleSheetData();

    // Mapear los datos a un formato adecuado para publicaciones.json
    const publicacionesData = publicaciones.map(row => ({
      titulo: row[0], // Título de la publicación (columna A)
      url: row[1],    // URL de la publicación (columna B)
    }));

    // Mapear los datos a un formato adecuado para novedades.json
    const novedadesData = novedades.map(row => ({
      titulo: row[0],    // Título de la novedad (columna A)
      descripcion: row[1], // Descripción de la novedad (columna B)
      fecha: row[2],      // Fecha de la novedad (columna C)
      imagen: row[3],     // URL de la imagen (columna D)
      contenido: row[4],  // Contenido de la novedad (columna E)
    }));

    // Ruta a los archivos JSON dentro de public/data
    const publicacionesPath = path.resolve('public/data/publicaciones.json');
    const novedadesPath = path.resolve('public/data/novedades.json');

    // Escribir el nuevo contenido en los archivos JSON
    await fs.promises.writeFile(publicacionesPath, JSON.stringify(publicacionesData, null, 2));
    await fs.promises.writeFile(novedadesPath, JSON.stringify(novedadesData, null, 2));

    console.log('publicaciones.json y novedades.json actualizados correctamente.');
  } catch (error) {
    console.error('Error al actualizar los archivos JSON:', error);
  }
}

// Ejecutar la función
updateDataJSON();
