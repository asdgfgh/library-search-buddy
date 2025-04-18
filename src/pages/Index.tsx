
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import FavoritesList from '@/components/FavoritesList';
import SearchModeSelector from '@/components/SearchModeSelector';
import { Book } from '@/lib/data';
import { filterBooksFromSheet, fetchBooksFromGoogleSheet, SearchMode } from '@/lib/google-sheets';
import { useToast } from '@/components/ui/use-toast';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FAVORITES_KEY = 'book-app-favorites';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode>('general');
  const { toast } = useToast();

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavoriteIds(parsedFavorites);
        }
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
    
    // Also fetch all books initially so we can populate favorites
    fetchAllBooks();
  }, []);
  
  // Update favorite books whenever favoriteIds or allBooks change
  useEffect(() => {
    if (favoriteIds.length > 0 && allBooks.length > 0) {
      const favorites = allBooks.filter(book => favoriteIds.includes(book.id));
      setFavoriteBooks(favorites);
    } else {
      setFavoriteBooks([]);
    }
  }, [favoriteIds, allBooks]);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Fetch all books (needed for favorites)
  const fetchAllBooks = async () => {
    try {
      const books = await fetchBooksFromGoogleSheet('general');
      setAllBooks(books);
    } catch (error) {
      console.error('Error fetching all books:', error);
    }
  };

  const handleSearch = async (query: string) => {
    console.log(`Searching for: "${query}" in mode: ${searchMode}`);
    setIsLoading(true);
    
    try {
      const results = await filterBooksFromSheet(query, searchMode);
      console.log(`Found ${results.length} results for "${query || 'all books'}" in ${searchMode} mode`);
      setSearchResults(results);
      setIsSearching(true);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching books:', error);
      toast({
        title: "Помилка пошуку",
        description: "Не вдалося знайти книги. Спробуйте пізніше.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search mode change
  const handleSearchModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    if (searchQuery || hasSearched) {
      handleSearch(searchQuery);
    }
  };
  
  // Toggle favorite status of a book
  const handleToggleFavorite = (bookId: string) => {
    setFavoriteIds(prevFavorites => {
      if (prevFavorites.includes(bookId)) {
        // Remove from favorites
        return prevFavorites.filter(id => id !== bookId);
      } else {
        // Add to favorites
        return [...prevFavorites, bookId];
      }
    });
  };
  
  // Update a book in search results (used for reservation status)
  const handleUpdateBook = (updatedBook: Book) => {
    setSearchResults(prevResults => 
      prevResults.map(book => 
        book.id === updatedBook.id ? updatedBook : book
      )
    );
    
    setAllBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === updatedBook.id ? updatedBook : book
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-16 md:pt-32 transition-all duration-500 pb-20">
      <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ${isSearching ? 'mb-8' : 'mb-0'}`}>
        <div className="text-center mb-10 px-6">
          <h1 className={`text-2xl md:text-3xl font-light text-foreground mb-2 transition-all duration-500 ${isSearching ? 'opacity-50 scale-90' : 'opacity-100'}`}>
            Бібліотека
          </h1>
          <p className={`text-muted-foreground transition-all duration-500 ${isSearching ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            Знайдіть потрібну книгу в нашій колекції з Google Sheets
          </p>
        </div>

        {/* Search mode selector */}
        <SearchModeSelector 
          selectedMode={searchMode}
          onSelectMode={handleSearchModeChange}
        />

        <div className="flex items-center justify-center max-w-xl mx-auto mb-6 gap-4 px-6">
          <SearchBar 
            onSearch={handleSearch} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
          />
          
          {/* Favorites button */}
          <Button
            variant="outline"
            className="flex-shrink-0 hover:bg-slate-50"
            onClick={() => setShowFavorites(true)}
            title="Показати улюблені книги"
          >
            <Heart className="h-5 w-5 mr-1" /> 
            <span className="hidden sm:inline">Улюблені</span>
            {favoriteIds.length > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground px-1.5 text-xs rounded-full">
                {favoriteIds.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="w-full max-w-5xl mx-auto px-6 text-center py-8">
          <p className="text-muted-foreground">Завантаження даних...</p>
        </div>
      )}

      {hasSearched && !isLoading && (
        <SearchResults 
          results={searchResults} 
          isVisible={isSearching}
          searchQuery={searchQuery || `всі ${searchMode === 'fiction' ? 'художні книги' : searchMode === 'textbooks' ? 'підручники' : 'книги'}`}
          onUpdateResults={handleUpdateBook}
          favorites={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {!isSearching && !isLoading && (
        <div className="mt-16 text-center opacity-70 transition-opacity duration-300 hover:opacity-90">
          <p className="text-sm text-muted-foreground">
            Введіть назву книги, автора або жанр щоб розпочати пошук, або натисніть пошук з пустим полем щоб побачити всі книги
          </p>
        </div>
      )}
      
      {/* Favorites overlay */}
      <FavoritesList 
        isVisible={showFavorites}
        favorites={favoriteBooks}
        onToggleFavorite={handleToggleFavorite}
        onClose={() => setShowFavorites(false)}
      />
    </div>
  );
};

export default Index;
