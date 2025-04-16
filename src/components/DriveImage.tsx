
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DriveImageProps {
  imageUrls: string[];
  title: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const DriveImage = ({ imageUrls, title, className, onLoad, onError }: DriveImageProps) => {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);
  
  // Preload image to test if it loads correctly
  useEffect(() => {
    if (imageUrls.length === 0) {
      setLoading(false);
      setAllFailed(true);
      onError?.();
      return;
    }
    
    // Reset states when image URLs change
    setLoading(true);
    setAllFailed(false);
    setCurrentUrlIndex(0);
    setLoadedUrl(null);
    
    const tryLoadImage = (index: number) => {
      if (index >= imageUrls.length) {
        console.error("All image URLs failed to load");
        setLoading(false);
        setAllFailed(true);
        onError?.();
        return;
      }
      
      const url = imageUrls[index];
      const img = new Image();
      
      img.onload = () => {
        setLoadedUrl(url);
        setLoading(false);
        onLoad?.();
      };
      
      img.onerror = () => {
        console.warn(`Failed to load image from URL: ${url}`);
        // Try next URL
        setCurrentUrlIndex(index + 1);
        tryLoadImage(index + 1);
      };
      
      img.src = url;
    };
    
    tryLoadImage(currentUrlIndex);
  }, [imageUrls, onError, onLoad]);

  if (allFailed) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <span className="text-xs text-muted-foreground">Немає зображення</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && <Skeleton className={`absolute inset-0 ${className}`} />}
      {loadedUrl && (
        <img
          src={loadedUrl}
          alt={title}
          className={`object-cover w-full h-full ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${className}`}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default DriveImage;
