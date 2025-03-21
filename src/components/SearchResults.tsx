
import { Book } from '@/lib/data';
import BookCard from './BookCard';
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((book, index) => (
            <div 
              key={book.id} 
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
