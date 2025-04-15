
import { Book } from '@/lib/data';
import { useDelayedMount } from '@/lib/animations';
import { X } from 'lucide-react';
import BookCard from './BookCard';

interface FavoritesListProps {
  isVisible: boolean;
  favorites: Book[];
  onToggleFavorite: (bookId: string) => void;
  onClose: () => void;
}

const FavoritesList = ({ isVisible, favorites, onToggleFavorite, onClose }: FavoritesListProps) => {
  const isMounted = useDelayedMount(isVisible, 300);
  
  if (!isMounted) return null;

  return (
    <div className={`fixed inset-0 z-40 bg-white/90 backdrop-blur-sm overflow-auto ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    } transition-all duration-300`}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium">Улюблені книги</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">У вас ще немає улюблених книг</p>
            <p className="text-sm text-muted-foreground mt-2">
              Натисніть на значок серця біля книги, щоб додати її до улюблених
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map(book => (
              <BookCard
                key={book.id}
                book={book}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
