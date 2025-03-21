
import { useEffect, useState } from 'react';

export function useDelayedMount(isVisible: boolean, delay: number = 300) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    
    if (isVisible) {
      setIsMounted(true);
    } else if (!isVisible && isMounted) {
      timerId = setTimeout(() => {
        setIsMounted(false);
      }, delay);
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isVisible, delay, isMounted]);

  return isMounted;
}

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isLocked]);
}

export function useBlurOverlay(isActive: boolean) {
  useEffect(() => {
    const content = document.getElementById('root');
    
    if (isActive && content) {
      content.classList.add('blur-sm', 'transition-all', 'duration-300');
    } else if (content) {
      content.classList.remove('blur-sm');
    }
    
    return () => {
      if (content) content.classList.remove('blur-sm');
    };
  }, [isActive]);
}
