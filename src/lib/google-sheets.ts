
import { Book } from './data';

// Base URL for Google Sheets API v4
const SHEET_ID = '113toypZnUAarE_JE36BU-oouHtMPnGceXmCyL5b7P4c';
const API_KEY = 'AIzaSyAWDvDK8Bp8T9IZqrQ_8CWtAGRV_eldPrk';
const RANGE = 'Sheet1!A2:H'; // Fetch data from Sheet1 

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

    console.log("Raw sheet data:", data.values);

    // Convert spreadsheet rows to Book objects
    return data.values.map((row, index) => {
      // Get all row values
      const id = row[0] || `sheet-${index}`;
      const author = row[1] || '';
      const title = row[2] || '';
      
      // Check for image URL in column D (index 3)
      const image = row[3] || '';
      
      // Get description from column E (index 4)
      const description = row[4] || '';
      
      // Check if book is available based on column F (index 5)
      const status = row[5] || '';
      const available = status !== 'заброньовано';
      
      // Parse year if present in column C (index 2), or use current year as default
      const yearStr = row[2] || '';
      const year = parseInt(yearStr, 10) || new Date().getFullYear();

      return {
        id,
        title,
        author,
        year,
        genre: row[6] || '',  // Column G (index 6) for genre if available
        description,
        available,
        image,
        status,
        rowIndex: index + 2 // +2 because we start from row 2 in sheet and need to account for 0-indexing
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
      book.id.toLowerCase().includes(lowercaseQuery) ||    // Column A (id/title)
      book.author.toLowerCase().includes(lowercaseQuery) || // Column B (author)
      book.title.toLowerCase().includes(lowercaseQuery) ||  // Column C (title)
      String(book.year).includes(lowercaseQuery)           // Year (if present)
    );
  });
}

// Function to reserve a book
export async function reserveBook(book: Book): Promise<boolean> {
  console.log("Attempting to reserve book:", book);
  try {
    // Google Sheets API requires OAuth2 for write operations, not just an API key
    // For now, we'll simulate a successful reservation
    console.log(`Would update row ${book.rowIndex} with 'заброньовано'`);
    
    // In a real implementation, you would use OAuth2 authentication
    // For demo purposes, we're simulating success
    return true;
    
    /* This would be the actual implementation with proper authentication
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!F${book.rowIndex}?valueInputOption=RAW&key=${API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [['заброньовано']] // Set status to "заброньовано"
      })
    });
    
    if (!response.ok) {
      console.error('Failed to reserve book:', await response.text());
      return false;
    }
    
    return true;
    */
  } catch (error) {
    console.error('Error reserving book:', error);
    return false;
  }
}
