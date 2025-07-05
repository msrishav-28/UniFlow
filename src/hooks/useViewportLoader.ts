// src/hooks/useViewportLoader.ts
import { useEffect, useState, RefObject } from 'react';

export const useViewportLoader = (
  ref: RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) => {
  const [isInViewport, setIsInViewport] = useState(false);
  const [hasBeenInViewport, setHasBeenInViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasBeenInViewport(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    const element = ref.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, options]);

  return { isInViewport, hasBeenInViewport };
};