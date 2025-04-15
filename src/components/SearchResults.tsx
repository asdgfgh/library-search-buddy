import { useState } from 'react';
import { Book } from '@/lib/data';
import { useDelayedMount } from '@/lib/animations';
import { Heart, Bookmark } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { reserveBook } from '@/lib/google-sheets';
import { Button } from '@/components/ui/button';

interface SearchResultsProps {
  results: Book[];
  isVisible: boolean;
  searchQuery: string;
  onUpdateResults: (book: Book) => void;
  favorites: string[];
  onToggleFavorite: (bookId: string) => void;
}

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
          {results.map((book, index) => (
            <div 
              key={book.id} 
              className="animate-fade-in p-4 border border-border rounded-lg bg-white/50 hover:bg-white/80 transition-all"
              style={{ animationDelay: `${Math.min(index * 0.05, 1)}s` }}
            >
              <div className="flex items-start gap-4">
                {book.image && (
                  <div className="hidden sm:block w-[120px] h-[160px] relative overflow-hidden flex-shrink-0 rounded-md border border-border">
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h3 className="font-medium">{book.title}</h3>
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
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    {book.author}, {book.year} • {book.genre}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-3">
                    {book.description}
                  </div>
                  
                  {book.available && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleReserveBook(book)}
                      disabled={reservingBookId === book.id}
                      className="flex items-center gap-1"
                    >
                      <Bookmark className="h-4 w-4" />
                      {reservingBookId === book.id ? 'Бронювання...' : 'Забронювати'}
                    </Button>
                  )}
                  
                  {!book.available && (
                    <div className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-gray-100 inline-block">
                      Заброньовано
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
