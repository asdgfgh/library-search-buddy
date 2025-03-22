
import { Book } from '@/lib/data';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
            />
          </>
        )}
        {!book.image && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Немає зображення</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {book.available ? 'Доступно' : 'Видано'}
          </span>
        </div>
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
      </div>
    </div>
  );
};

export default BookCard;
