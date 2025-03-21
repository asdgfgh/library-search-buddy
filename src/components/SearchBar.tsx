
import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
}

const SearchBar = ({ onSearch, searchQuery, setSearchQuery, isSearching }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className={`w-full max-w-xl mx-auto px-6 transition-all duration-500 ${isSearching ? 'scale-90 opacity-90' : 'scale-100 opacity-100'}`}>
      <form 
        onSubmit={handleSubmit}
        className={`relative flex items-center transition-all duration-300 ${
          isFocused 
            ? 'shadow-[0_0_0_1px_rgba(59,130,246,0.6),0_3px_10px_rgba(0,0,0,0.1)] bg-white rounded-2xl animate-glow' 
            : 'shadow-[0_2px_10px_rgba(0,0,0,0.08)] bg-white/80 rounded-xl'
        }`}
      >
        <Search 
          className={`ml-4 h-5 w-5 transition-colors duration-200 ${
            isFocused ? 'text-primary' : 'text-muted-foreground'
          }`} 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Пошук книг за назвою, автором, жанром..."
          className="flex-1 h-14 bg-transparent px-4 outline-none text-foreground placeholder:text-muted-foreground"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 mr-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
