import { useState } from 'react';
import { Book } from '@/lib/data';
import { useDelayedMount } from '@/lib/animations';
import { Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { reserveBook } from '@/lib/google-sheets';
import DriveImage from './DriveImage';
import { Badge } from './ui/badge';

interface SearchResultsProps {
  results: Book[];
  isVisible: boolean;
  searchQuery: string;
  onUpdateResults: (book: Book) => void;
  favorites: string[];
  onToggleFavorite: (bookId: string) => void;
}

const renderStatusLabel = (status?: string) => {
  const trimmed = status?.trim().toLowerCase() || '';
  if (trimmed.includes('заброньовано') || trimmed.includes('видано')) {
    return <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md">{status}</span>;
  } else if (!trimmed) {
    return <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md">Доступна</span>;
  } else {
    return <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md">{status}</span>;
  }
};

const SearchResults = ({ 
  results, 
  isVisible, 
  searchQuery,
  onUpdateResults,
  favorites,
  onToggleFavorite
}: SearchResultsProps) => {
  const isMounted = useDelayedMount(isVisible, 300);
  const { toast } = useToast();
  const [reservingBookId, setReservingBookId] = useState<string | null>(null);
  
  if (!isMounted) return null;

  const handleReserveBook = async (book: Book) => {
    setReservingBookId(book.id);
    console.log("Reserving book:", book);
    
    try {
      const success = await reserveBook(book);
      
      if (success) {
        const updatedBook = { ...book, available: false, status: 'заброньовано' };
        onUpdateResults(updatedBook);
        
        toast({
          title: "Книгу заброньовано",
          description: `Книгу "${book.title}" успішно заброньовано`,
        });
      } else {
        toast({
          title: "Помилка бронювання",
          description: "Не вдалося забронювати книгу. Спробуйте пізніше.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Помилка бронювання",
        description: "Не вдалося забронювати книгу. Спробуйте пізніше.",
        variant: "destructive"
      });
    } finally {
      setReservingBookId(null);
    }
  };

  const handleToggleFavorite = (bookId: string) => {
    onToggleFavorite(bookId);
  };

  const isBookInFavorites = (bookId: string) => favorites.includes(bookId);

  const isBookAvailable = (status?: string) => {
    if (!status || status.trim() === '') return true;
    const statusLowerCase = status.trim().toLowerCase();
    return !statusLowerCase.includes('заброньовано') && !statusLowerCase.includes('видано');
  };

  return (
    <div 
      className={`w-full max-w-5xl mx-auto px-6 transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">
          {results.length > 0 
            ? `Знайдено ${results.length} книг за запитом "${searchQuery}"`
            : `Книг за запитом "${searchQuery}" не знайдено`
          }
        </p>
      </div>
      
      {results.length > 0 && (
        <div className="flex flex-col space-y-4">
          {results.map((book, index) => {
            const imageUrls = book.imageUrls || (book.image ? [book.image] : []);
            const isAvailable = isBookAvailable(book.status);
            
            return (
              <div 
                key={book.id} 
                className={`animate-fade-in p-4 border rounded-lg transition-all ${
                  isAvailable 
                    ? 'bg-[#F2FCE2]/50 hover:bg-[#F2FCE2]/80 border-green-200' 
                    : 'bg-white/50 hover:bg-white/80 border-red-200'
                }`}
                style={{ animationDelay: `${Math.min(index * 0.05, 1)}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-[100px] sm:w-[120px] h-[140px] sm:h-[160px] relative overflow-hidden flex-shrink-0 rounded-md border border-border">
                    {imageUrls.length > 0 ? (
                      <DriveImage
                        imageUrls={imageUrls}
                        title={book.title}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-muted">
                        <span className="text-xs text-muted-foreground">Немає зображення</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {book.classField && <span className="mr-2">{book.classField}</span>}
                          {book.inventoryNumber && <span>№{book.inventoryNumber}</span>}
                          {book.copiesCount && book.copiesCount !== '0' && (
                            <span className="ml-2 text-primary">
                              {book.copiesCount} прим.
                            </span>
                          )}
                        </div>
                        <Badge
                          variant={isAvailable ? "default" : "destructive"}
                          className={`text-xs ${
                            isAvailable 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-red-500 hover:bg-red-600'
                          }`}
                        >
                          {isAvailable ? 'Доступна' : 'Недоступна'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFavorite(book.id)}
                          className={`p-1 rounded-full transition-colors ${
                            isBookInFavorites(book.id) 
                              ? 'text-red-500 hover:bg-red-50' 
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={isBookInFavorites(book.id) ? "Видалити з улюблених" : "Додати до улюблених"}
                        >
                          <Heart className={`h-5 w-5 ${isBookInFavorites(book.id) ? 'fill-red-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-medium mb-1">{book.title}</h3>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      {book.author} 
                      {book.bookType && (
                        <span className="ml-2 text-xs bg-slate-100 px-1.5 py-0.5 rounded-full">
                          {book.bookType === 'textbook' ? 'Підручник' : 'Художня'}
                        </span>
                      )}
                    </div>
                    
                    {book.description && (
                      <div className="text-sm text-muted-foreground mb-3">
                        {book.description}
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs inline-block">
                      {renderStatusLabel(book.status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
