
export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
  available: boolean;
  image: string;
  imageUrls?: string[]; // Array of possible image URLs to try
  rawImageUrl?: string;
  status?: string;
  rowIndex?: number;
  classField?: string; // Added field for class (column A)
  inventoryNumber?: string; // Added field for inventory number (column B)
  bookType?: 'fiction' | 'textbook'; // Type of book: fiction or textbook
}

export type BookSort = 'title' | 'author' | 'year' | 'available';
