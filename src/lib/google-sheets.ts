
import { Book } from './data';

// Base URL for Google Sheets API v4
const SHEET_ID = '113toypZnUAarE_JE36BU-oouHtMPnGceXmCyL5b7P4c';
const API_KEY = 'AIzaSyAWDvDK8Bp8T9IZqrQ_8CWtAGRV_eldPrk';
const RANGE = 'Sheet1!A2:H'; // Fetch data from Sheet1 

/**
 * Converts a Google Drive link to a direct download link
 * @param driveUrl Google Drive URL (can be view or sharing URL)
 * @returns Direct download URL for the image
 */
function convertGoogleDriveLink(driveUrl: string): string {
  if (!driveUrl) return '';
  
  // Check if it's already a direct download link
  if (driveUrl.includes('googleusercontent.com') || driveUrl.includes('uc?export=view&id=')) {
    return driveUrl;
  }
  
  // Extract file ID from various Google Drive URL formats
  let fileId = '';
  
  // Format: https://drive.google.com/file/d/{fileId}/view
  const fileViewMatch = driveUrl.match(/\/file\/d\/([^\/]+)/);
  if (fileViewMatch && fileViewMatch[1]) {
    fileId = fileViewMatch[1];
  }
  
  // Format: https://drive.google.com/open?id={fileId}
  const openIdMatch = driveUrl.match(/\?id=([^&]+)/);
  if (openIdMatch && openIdMatch[1]) {
    fileId = openIdMatch[1];
  }
  
  // Format: https://docs.google.com/presentation/d/{fileId}/edit
  const presentationMatch = driveUrl.match(/\/d\/([^\/]+)\//);
  if (presentationMatch && presentationMatch[1]) {
    fileId = presentationMatch[1];
  }
  
  if (fileId) {
    // Return direct download URL
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // If no valid file ID found, return the original URL
  return driveUrl;
}

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
      
      // Check for image URL in column D (index 3) and convert Google Drive links
      const rawImageUrl = row[3] || '';
      const image = rawImageUrl ? convertGoogleDriveLink(rawImageUrl) : '';
      
      // Get description from column E (index 4)
      const description = row[4] || '';
      
      // Check if book is available based on column F (index 5)
      const status = row[5] || '';
      const available = status !== 'заброньовано';
      
      // Parse year if present in column G (index 6), or use current year as default
      let year = new Date().getFullYear();
      if (row[6] && !isNaN(parseInt(row[6], 10))) {
        year = parseInt(row[6], 10);
      }

      return {
        id,
        title,
        author,
        year,
        genre: row[7] || '',  // Column H (index 7) for genre if available
        description,
        available,
        image,
        rawImageUrl: rawImageUrl, // Store the original URL for download
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
      (book.title && book.title.toLowerCase().includes(lowercaseQuery)) ||
      (book.author && book.author.toLowerCase().includes(lowercaseQuery)) ||
      (book.genre && book.genre.toLowerCase().includes(lowercaseQuery)) ||
      (book.year && String(book.year).includes(lowercaseQuery)) ||
      (book.description && book.description.toLowerCase().includes(lowercaseQuery))
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
  } catch (error) {
    console.error('Error reserving book:', error);
    return false;
  }
}
