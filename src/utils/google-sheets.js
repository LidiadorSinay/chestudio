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
    const sheets = google.sheets({ version: 'v4', auth });

    // ID de la hoja de cálculo y el rango de celdas
    const spreadsheetId = '1F26RlGkmd9KenJ4ljVUpQJfj7cTfk3jhD9exhVmJlC4'; // Reemplázalo con tu ID de hoja
    const range = 'publicaciones!A1:B10'; // Ajusta el rango según tu hoja

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    return rows;
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error);
    throw error;
  }
}

export { fetchGoogleSheetData };
