
export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
  available: boolean;
  // New fields
  image?: string;
  status?: string;
  rowIndex?: number;
}
