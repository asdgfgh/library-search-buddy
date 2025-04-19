
import { Book } from '@/lib/data';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import DriveImage from './DriveImage';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
}

const BookCard = ({ book, isFavorite, onToggleFavorite }: BookCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(book.id);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const imageUrls = book.imageUrls || (book.image ? [book.image] : []);
  const isAvailable = !book.status || book.status.trim() === '';

  return (
    <div 
      className="relative overflow-hidden rounded-xl border border-border bg-white/50 transition-all duration-300 hover:shadow-md"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        {imageUrls.length > 0 && !imageError ? (
          <DriveImage
            imageUrls={imageUrls}
            title={book.title}
            className="w-full h-full"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
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
        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
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
        
        {/* Status indicator with updated display */}
        {book.status && book.status.trim() !== '' ? (
          <div className={`mt-3 text-xs px-2 py-1 rounded-md inline-block bg-red-50 text-red-600`}>
            {book.status}
          </div>
        ) : (
          <div className="mt-3 text-xs px-2 py-1 rounded-md inline-block bg-green-50 text-green-700">
            Доступна
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
