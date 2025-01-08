import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Ruta al archivo JSON de credenciales
const credentialsPath = path.resolve('src/credentials.json'); // Ajusta la ruta si es necesario

// Leer el archivo de credenciales
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

async function fetchGoogleSheetData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    });

    // Crear el cliente de la API de Sheets
    const sheets = google.sheets({ version: 'v4', auth, timeout: 10000 });

    // ID de la hoja de cálculo
    const spreadsheetId = '1F26RlGkmd9KenJ4ljVUpQJfj7cTfk3jhD9exhVmJlC4'; // 

    // Solicitar los datos de las pestañas "publicaciones" y "novedades"
    const publicacionesRange = 'publicaciones!A1:B10'; // Ajusta el rango según tu hoja
    const novedadesRange = 'novedades!A1:E10'; // Ajusta el rango de la pestaña novedades

    const [publicacionesResponse, novedadesResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: publicacionesRange,
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: novedadesRange,
      }),
    ]);

    const publicaciones = publicacionesResponse.data.values;
    const novedades = novedadesResponse.data.values;

    return { publicaciones, novedades };
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error);
    throw error;
  }
}

export { fetchGoogleSheetData };
