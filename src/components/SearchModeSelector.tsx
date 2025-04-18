
import React from 'react';
import { Book, TextBook, GraduationCap } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SearchMode } from '@/lib/google-sheets';

interface SearchModeSelectorProps {
  selectedMode: SearchMode;
  onSelectMode: (mode: SearchMode) => void;
}

const SearchModeSelector: React.FC<SearchModeSelectorProps> = ({ 
  selectedMode, 
  onSelectMode 
}) => {
  return (
    <div className="flex justify-center mb-6">
      <ToggleGroup 
        type="single" 
        value={selectedMode} 
        onValueChange={(value) => value && onSelectMode(value as SearchMode)}
        className="bg-white/50 border border-border rounded-lg p-1 shadow-sm"
      >
        <ToggleGroupItem 
          value="general" 
          aria-label="General search"
          className="flex items-center gap-2 px-4 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md"
        >
          <Book className="h-4 w-4" />
          <span>Загальний</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="fiction" 
          aria-label="Fiction books search"
          className="flex items-center gap-2 px-4 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md"
        >
          <TextBook className="h-4 w-4" />
          <span>Художня</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="textbooks" 
          aria-label="Textbooks search"
          className="flex items-center gap-2 px-4 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md"
        >
          <GraduationCap className="h-4 w-4" />
          <span>Підручники</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default SearchModeSelector;
