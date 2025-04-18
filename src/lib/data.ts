
export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
  available: boolean;
  image: string;
  imageUrls?: string[];
  rawImageUrl?: string;
  status?: string;
  rowIndex?: number;
  classField?: string;
  inventoryNumber?: string;
  bookType?: 'fiction' | 'textbook';
  copiesCount?: string; // Added field for number of copies
}

export type BookSort = 'title' | 'author' | 'year' | 'available';
