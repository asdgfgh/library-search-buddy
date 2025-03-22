
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import { filterBooks, Book } from '@/lib/data';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    if (query.trim()) {
      const results = filterBooks(query);
      console.log(`Found ${results.length} results for "${query}"`);
      setSearchResults(results);
      setIsSearching(true);
      setHasSearched(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-16 md:pt-32 transition-all duration-500 pb-20">
      <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ${isSearching ? 'mb-8' : 'mb-0'}`}>
        <div className="text-center mb-10 px-6">
          <h1 className={`text-2xl md:text-3xl font-light text-foreground mb-2 transition-all duration-500 ${isSearching ? 'opacity-50 scale-90' : 'opacity-100'}`}>
            Бібліотека
          </h1>
          <p className={`text-muted-foreground transition-all duration-500 ${isSearching ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            Знайдіть потрібну книгу в нашій колекції
          </p>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
        />
      </div>

      {hasSearched && (
        <SearchResults 
          results={searchResults} 
          isVisible={isSearching}
          searchQuery={searchQuery}
        />
      )}

      {!isSearching && (
        <div className="mt-16 text-center opacity-70 transition-opacity duration-300 hover:opacity-90">
          <p className="text-sm text-muted-foreground">
            Введіть назву книги, автора або жанр щоб розпочати пошук
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
