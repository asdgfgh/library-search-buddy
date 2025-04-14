
import { Book } from './data';

// Base URL for Google Sheets API v4
const SHEET_ID = '113toypZnUAarE_JE36BU-oouHtMPnGceXmCyL5b7P4c';
const API_KEY = 'AIzaSyAWDvDK8Bp8T9IZqrQ_8CWtAGRV_eldPrk';
const RANGE = 'Sheet1!A2:H'; // Changed from 'books!A2:H' to 'Sheet1!A2:H'

export async function fetchBooksFromGoogleSheet(): Promise<Book[]> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (!response.ok) {
      console.error('Failed to fetch data from Google Sheets:', await response.text());
      return [];
    }

    const data = await response.json() as { values?: string[][] };
    
    if (!data.values || data.values.length === 0) {
      console.log('No data found in the Google Sheet');
      return [];
    }

    // Convert spreadsheet rows to Book objects
    return data.values.map((row, index) => {
      // Get all row values, use empty string for missing values
      const allValues = [...row];
      
      // Extract standard fields (first 7 columns)
      const [title = '', author = '', yearStr = '', genre = '', description = '', availableStr = 'true', id = `sheet-${index}`] = allValues;
      
      // Parse year as number, default to current year if invalid
      const year = parseInt(yearStr, 10) || new Date().getFullYear();
      
      // Parse available as boolean (not displayed in UI now)
      const available = availableStr.toLowerCase() === 'true';

      // Check for any additional data in the row (8th column and beyond)
      const extraData = allValues.slice(7).filter(Boolean).join(' ');

      return {
        id,
        title,
        author,
        year,
        genre,
        description: extraData ? `${description} ${extraData}`.trim() : description,
        available
      };
    });
  } catch (error) {
    console.error('Error fetching books from Google Sheets:', error);
    return [];
  }
}

export async function filterBooksFromSheet(query: string): Promise<Book[]> {
  const books = await fetchBooksFromGoogleSheet();
  
  if (!query) return books; // Return all books if query is empty
  
  const lowercaseQuery = query.toLowerCase().trim();
  
  return books.filter(book => {
    return (
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.genre.toLowerCase().includes(lowercaseQuery) ||
      book.description.toLowerCase().includes(lowercaseQuery) ||
      String(book.year).includes(lowercaseQuery)
    );
  });
}
