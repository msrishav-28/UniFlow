import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { haptics } from '../utils/hapticFeedback';

// Gesture Hook for Navigation
export const useGestureNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  const routes = ['/', '/categories', '/saved', '/profile'];
  const currentIndex = routes.indexOf(location.pathname);

  const navigateToIndex = (index: number) => {
    if (index >= 0 && index < routes.length && !isNavigating) {
      setIsNavigating(true);
      haptics.tap();
      navigate(routes[index]);
      setTimeout(() => setIsNavigating(false), 300);
    }
  };

  return {
    currentIndex,
    routes,
    navigateToIndex,
    canGoLeft: currentIndex > 0,
    canGoRight: currentIndex < routes.length - 1,
  };
};

// Pinch to Zoom Gesture
export const usePinchToZoom = (ref: React.RefObject<HTMLElement>) => {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let initialDistance = 0;
    let initialScale = 1;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialScale = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const newScale = (currentDistance / initialDistance) * initialScale;
        setScale(Math.max(0.5, Math.min(3, newScale)));
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [ref, scale]);

  return { scale, setScale };
};

// Long Press Detection
export const useLongPress = (
  callback: () => void,
  options: { delay?: number; shouldPreventDefault?: boolean } = {}
) => {
  const { delay = 500, shouldPreventDefault = true } = options;
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    if (shouldPreventDefault && event.target) {
      event.target.addEventListener('touchend', preventDefault, { passive: false });
      target.current = event.target;
    }
    
    timeout.current = setTimeout(() => {
      haptics.success();
      callback();
    }, delay);
  }, [callback, delay, shouldPreventDefault]);

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
    
    if (shouldPreventDefault && target.current) {
      target.current.removeEventListener('touchend', preventDefault);
    }
  }, [shouldPreventDefault]);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  };
};

// Double Tap Handler
export const useDoubleTap = (callback: () => void, delay: number = 300) => {
  const [lastTap, setLastTap] = useState(0);

  const handleTap = useCallback(() => {
    const now = Date.now();
    
    if (now - lastTap < delay) {
      haptics.tap();
      callback();
    }
    
    setLastTap(now);
  }, [callback, delay, lastTap]);

  return { onTouchEnd: handleTap };
};

// Helper function
const preventDefault = (e: Event) => {
  if (!e.cancelable) return;
  e.preventDefault();
};