import { fetchGoogleSheetData } from './google-sheets.js';
import fs from 'fs';
import path from 'path';

async function updateDataJSON() {
  try {
    // Obtener los datos de Google Sheets
    const { publicaciones, novedades, features, about } = await fetchGoogleSheetData();

    // Mapear los datos a un formato adecuado para publicaciones.json
    const publicacionesData = publicaciones.map(row => ({
      titulo: row[0], // Título de la publicación (columna A)
      url: row[1],    // URL de la publicación (columna B)
    }));

    // Mapear los datos a un formato adecuado para novedades.json
    const novedadesData = novedades.map(row => ({
      titulo: row[0],    // Título de la novedad (columna A)
      descripcion: row[1], // Descripción de la novedad (columna B)
      fecha: row[3],      // Fecha de la novedad (columna C)
      imagen: row[2],     // URL de la imagen (columna D)
      contenido: row[4],  // Contenido de la novedad (columna E)
    }));

      // Mapear los datos a un formato adecuado para novedades.json
      const featuresData = features.map(row => ({
        title: row[0],   
        description: row[1], 
        icon: row[2],      
        astroIcon: row[3],     
      }));

      
      // Mapear los datos a un formato adecuado para novedades.json
      const aboutData = about.map(row => ({
        name: row[0],   
        role: row[1], 
        img: row[2],      
        desc1: row[3], 
        desc2: row[4], 
        desc3: row[5],     
        linkedin: row[6],         
      }));


      

    // Ruta a los archivos JSON dentro de public/data
    const publicacionesPath = path.resolve('public/data/publicaciones.json');
    const novedadesPath = path.resolve('public/data/novedades.json');
    const featuresPath = path.resolve('public/data/features.json');
    const aboutPath = path.resolve('public/data/about.json');



    // Escribir el nuevo contenido en los archivos JSON
    await fs.promises.writeFile(publicacionesPath, JSON.stringify(publicacionesData, null, 2));
    await fs.promises.writeFile(novedadesPath, JSON.stringify(novedadesData, null, 2));
    await fs.promises.writeFile(featuresPath, JSON.stringify(featuresData, null, 2));
    await fs.promises.writeFile(aboutPath, JSON.stringify(aboutData, null, 2));


    console.log('publicaciones.json, features.json, about.json novedades.json actualizados correctamente.');
  } catch (error) {
    console.error('Error al actualizar los archivos JSON:', error);
  }
}

// Ejecutar la función
updateDataJSON();
