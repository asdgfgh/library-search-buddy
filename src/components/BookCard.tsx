
import { Book } from '@/lib/data';
import { useState } from 'react';
import { Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
}

const BookCard = ({ book, isFavorite, onToggleFavorite }: BookCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(book.id);
  };

  const handleDownloadImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.rawImageUrl) {
      // Use the raw image URL for download if available
      window.open(book.rawImageUrl, '_blank');
    } else if (book.image) {
      window.open(book.image, '_blank');
    }
  };

  return (
    <div 
      className="relative overflow-hidden rounded-xl border border-border bg-white/50 transition-all duration-300 hover:shadow-md"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        {book.image && (
          <>
            <div className={`absolute inset-0 bg-muted animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}></div>
            <img
              src={book.image}
              alt={book.title}
              onLoad={() => setImageLoaded(true)}
              className={`object-cover w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onError={(e) => {
                console.error("Image failed to load:", book.image);
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Download button */}
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                onClick={handleDownloadImage}
                className="p-2 rounded-full backdrop-blur-sm bg-white/70 text-gray-700 hover:bg-white/90 transition-colors"
                title="Відкрити зображення"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
        {!book.image && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Немає зображення</span>
          </div>
        )}
        
        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-colors ${
            isFavorite 
              ? 'bg-white/70 text-red-500 hover:bg-white/90' 
              : 'bg-white/50 text-gray-400 hover:bg-white/70'
          }`}
          title={isFavorite ? "Видалити з улюблених" : "Додати до улюблених"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="text-xs text-primary font-medium mb-1">{book.genre}</div>
        <h3 className="font-medium text-lg">{book.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{book.author}, {book.year}</p>
        <p className={`text-sm text-muted-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
          {book.description}
        </p>
        {book.description && book.description.length > 100 && (
          <button 
            onClick={toggleExpand} 
            className="text-xs text-primary mt-2 hover:underline"
          >
            {isExpanded ? 'Згорнути' : 'Розгорнути'}
          </button>
        )}
        
        {/* Status indicator */}
        {!book.available && (
          <div className="mt-3 text-xs px-2 py-1 rounded-md bg-gray-100 inline-block text-muted-foreground">
            Заброньовано
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
