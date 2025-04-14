
import { Book } from '@/lib/data';
import { useDelayedMount } from '@/lib/animations';

interface SearchResultsProps {
  results: Book[];
  isVisible: boolean;
  searchQuery: string;
}

const SearchResults = ({ results, isVisible, searchQuery }: SearchResultsProps) => {
  const isMounted = useDelayedMount(isVisible, 300);
  
  if (!isMounted) return null;

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
        <div className="flex flex-col space-y-2">
          {results.map((book, index) => (
            <div 
              key={book.id} 
              className="animate-fade-in p-3 border border-border rounded-lg bg-white/50 hover:bg-white/80 transition-all"
              style={{ animationDelay: `${Math.min(index * 0.05, 1)}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{book.title}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {book.author}, {book.year} • {book.genre}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {book.description}
                  </div>
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
