import { Book } from '@/lib/data';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import DriveImage from './DriveImage';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
}

// Helper to highlight status keywords as badge pills in status field
function renderStatusWithBadges(status?: string) {
  if (!status) return null;

  // Define mapping for keywords and their styles
  const badgeMap: Record<string, { bg: string; text: string }> = {
    "Доступна": { bg: "bg-green-100", text: "text-green-800" },
    "Видано": { bg: "bg-red-100", text: "text-red-800" },
    "Заброньовано": { bg: "bg-orange-100", text: "text-orange-800" },
  };

  // Regex to match only the keywords, not substrings inside other words
  const regex = /(Доступна|Видано|Заброньовано)/g;

  // Split the text by keywords and interleave
  const parts = status.split(regex);

  return (
    <div className="mt-2" aria-label="Статус книги">
      {parts.map((part, i) => {
        if (badgeMap.hasOwnProperty(part)) {
          const { bg, text } = badgeMap[part];
          return (
            <span
              key={`${part}-${i}`}
              className={`${bg} ${text} rounded-full px-2 py-1 text-xs inline-block font-semibold ml-0 mr-2 mb-1`}
              aria-label={part}
              role="status"
            >
              {part}
            </span>
          );
        }
        // Render plain text for any other parts
        return part ? (
          <span key={i} className="text-muted-foreground">{part}</span>
        ) : null;
      })}
    </div>
  );
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

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-white/50 transition-all duration-300 hover:shadow-md">
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

        {book.status && renderStatusWithBadges(book.status)}
      </div>
    </div>
  );
};

export default BookCard;
