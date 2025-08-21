// src/utils/google-sheets.js
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Ruta al archivo JSON de credenciales
const credentialsPath = path.resolve('src/credentials.json'); // Ajusta la ruta si es necesario

// Leer el archivo de credenciales
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

export async function fetchGoogleSheetData() {
  try {
    // Autenticación de Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    });

    // Cliente de la API de Google Sheets
    const sheets = google.sheets({ version: 'v4', auth });

    // ID de la hoja de cálculo
    const spreadsheetId = '1F26RlGkmd9KenJ4ljVUpQJfj7cTfk3jhD9exhVmJlC4'; // 

    // Rango de las pestañas a consultar
    const publicacionesRange = 'publicaciones!A1:B20'; 
    const novedadesRange = 'novedades!A1:F20'; 
    const featuresRange = 'features!A1:D20'; 
    const aboutRange = 'about!A1:G10';
    const carruselRange = 'carrusel!A1:F10'; // NUEVO
    
 


    // Obtener los datos de ambas pestañas
    const [publicacionesResponse, novedadesResponse, featuresResponse, aboutResponse, carruselResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: publicacionesRange,
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: novedadesRange,
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: featuresRange,
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: aboutRange,
      }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: carruselRange })

    ]);

    // Extraemos los datos de las respuestas
    const publicaciones = publicacionesResponse.data.values;
    const novedades = novedadesResponse.data.values;
    const features = featuresResponse.data.values;
    const about = aboutResponse.data.values;
    const carrusel = carruselResponse.data.values;

    


    // Devolvemos los datos obtenidos
    return { publicaciones, novedades, features, about, carrusel };
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error);
    throw error;
  }
}
