import { Book } from './data';

// Base URL for Google Sheets API v4
const SHEET_ID = '113toypZnUAarE_JE36BU-oouHtMPnGceXmCyL5b7P4c';
const API_KEY = 'AIzaSyAWDvDK8Bp8T9IZqrQ_8CWtAGRV_eldPrk';

// Sheet ranges for different book types
const RANGES = {
  fiction: 'Sheet1!A2:H',    // Fiction books in Sheet1
  textbooks: 'Sheet2!A2:H',  // Textbooks in Sheet2
};

// Search mode type definition
export type SearchMode = 'general' | 'fiction' | 'textbooks';

/**
 * Converts a Google Drive link to a direct download link or tries multiple formats
 * @param driveUrl Google Drive URL (can be view or sharing URL)
 * @returns An array of possible image URLs to try
 */
function convertGoogleDriveLink(driveUrl: string): string[] {
  if (!driveUrl) return [];
  
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
  
  if (!fileId) {
    // If no valid file ID found, return the original URL
    console.log("Could not extract file ID from:", driveUrl);
    return [driveUrl];
  }
  
  // Return an array of possible URLs to try
  return [
    // Proxy server for Google Drive content (avoid CORS issues)
    `https://proxy-server.lovable.dev/google-image/${fileId}`,
    // Direct thumbnail (often works for public images)
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
    // Alternative Google Drive formats
    `https://lh3.googleusercontent.com/d/${fileId}`,
    // Public content format
    `https://drive.usercontent.google.com/download/dm/${fileId}`,
    // Preview format (browser-rendered)
    `https://drive.google.com/file/d/${fileId}/preview`,
    // Standard export view (which has CORS issues)
    `https://drive.google.com/uc?export=view&id=${fileId}`,
  ];
}

/**
 * Fetches books from a specific Google Sheet range
 */
async function fetchSheetData(range: string): Promise<Book[]> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
    );

    if (!response.ok) {
      console.error('Failed to fetch data from Google Sheets:', await response.text());
      return [];
    }

    const data = await response.json() as { values?: string[][] };
    
    if (!data.values || data.values.length === 0) {
      console.log(`No data found in the range: ${range}`);
      return [];
    }

    console.log(`Raw sheet data for ${range}:`, data.values);

    // Determine book type based on which sheet it came from
    const isTextbook = range.includes('Sheet2');
    
    // Convert spreadsheet rows to Book objects
    return data.values.map((row, index) => {
      // A: Class, B: Inventory number, C: Author, D: Title, E: Image URL (updated)
      const classField = row[0] || '';
      const inventoryNumber = row[1] || '';
      const author = row[2] || '';
      const title = row[3] || '';
      
      // Use inventory number or index+sheet for ID to ensure uniqueness
      const id = inventoryNumber || `${isTextbook ? 'textbook' : 'fiction'}-${index}`;
      
      // Get image URL from column D (index 3) and convert Google Drive links
      const rawImageUrl = row[4] || ''; // Updated to use Column E for image URL
      const imageUrls = rawImageUrl ? convertGoogleDriveLink(rawImageUrl) : [];
      
      // Get description from column F (index 5) if available
      const description = row[5] || '';
      
      // Check if book is available based on column G (index 6)
      const status = row[6] || '';
      const available = status !== 'заброньовано';
      
      // Parse year if present in column H (index 7), or use current year as default
      let year = new Date().getFullYear();
      if (row[7] && !isNaN(parseInt(row[7], 10))) {
        year = parseInt(row[7], 10);
      }

      // Determine which sheet this book came from
      const genre = isTextbook ? 'підручник' : (row[7] || '');
      
      return {
        id,
        title,
        author,
        year,
        genre,
        description,
        available,
        image: imageUrls.length > 0 ? imageUrls[0] : '',
        imageUrls, // Store all possible image URLs
        rawImageUrl, // Store the original URL
        status,
        rowIndex: index + 2, // +2 because we start from row 2 in sheet and need to account for 0-indexing
        classField, // Store class field
        inventoryNumber, // Store inventory number
        bookType: isTextbook ? 'textbook' : 'fiction' // Add book type
      };
    });
  } catch (error) {
    console.error('Error fetching books from Google Sheets:', error);
    return [];
  }
}

/**
 * Fetches books from all sheets or specific sheets based on search mode
 */
export async function fetchBooksFromGoogleSheet(searchMode: SearchMode = 'general'): Promise<Book[]> {
  try {
    let books: Book[] = [];

    // Fetch books based on search mode
    if (searchMode === 'general' || searchMode === 'fiction') {
      const fictionBooks = await fetchSheetData(RANGES.fiction);
      books = [...books, ...fictionBooks];
    }
    
    if (searchMode === 'general' || searchMode === 'textbooks') {
      const textbooks = await fetchSheetData(RANGES.textbooks);
      books = [...books, ...textbooks];
    }

    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

/**
 * Filters books based on search query and search mode, removing duplicates
 */
export async function filterBooksFromSheet(query: string, searchMode: SearchMode = 'general'): Promise<Book[]> {
  const books = await fetchBooksFromGoogleSheet(searchMode);
  
  if (!query) return books; // Return all books if query is empty
  
  const lowercaseQuery = query.toLowerCase().trim();
  
  // Create a Map to track unique books by inventory number/id
  const uniqueBooks = new Map<string, Book>();
  
  books.filter(book => {
    const matches = (
      (book.title && book.title.toLowerCase().includes(lowercaseQuery)) ||
      (book.author && book.author.toLowerCase().includes(lowercaseQuery)) ||
      (book.genre && book.genre.toLowerCase().includes(lowercaseQuery)) ||
      (book.classField && book.classField.toLowerCase().includes(lowercaseQuery)) ||
      (book.inventoryNumber && book.inventoryNumber.toLowerCase().includes(lowercaseQuery)) ||
      (book.year && String(book.year).includes(lowercaseQuery)) ||
      (book.description && book.description.toLowerCase().includes(lowercaseQuery))
    );

    if (matches) {
      // Use inventory number or id as unique identifier
      const uniqueId = book.inventoryNumber || book.id;
      if (!uniqueBooks.has(uniqueId)) {
        uniqueBooks.set(uniqueId, book);
      }
    }
  });
  
  return Array.from(uniqueBooks.values());
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
