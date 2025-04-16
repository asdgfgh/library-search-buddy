
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
}

export type BookSort = 'title' | 'author' | 'year' | 'available';
