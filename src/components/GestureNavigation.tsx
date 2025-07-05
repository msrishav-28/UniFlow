import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

// Swipeable Page Wrapper
interface SwipeablePageProps {
  children: React.ReactNode;
  className?: string;
}

export const SwipeablePage: React.FC<SwipeablePageProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentIndex, navigateToIndex, canGoLeft, canGoRight } = useGestureNavigation();
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Visual feedback during swipe
  const backgroundOpacity = useTransform(x, [-200, 0, 200], [0.3, 0, 0.3]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleDragStart = () => {
    setIsDragging(true);
    haptics.tap();
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Navigate based on swipe direction and velocity
    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0 && canGoLeft) {
        navigateToIndex(currentIndex - 1);
      } else if (offset < 0 && canGoRight) {
        navigateToIndex(currentIndex + 1);
      }
    }
  };

  return (
    <motion.div
      className={`relative w-full h-full ${className}`}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={{ x: 0 }}
      style={{ x, scale }}
    >
      {/* Background overlay for visual feedback */}
      <motion.div
        className="absolute inset-0 bg-primary-500 pointer-events-none"
        style={{ opacity: backgroundOpacity }}
      />
      
      {/* Swipe indicators */}
      {isDragging && (
        <>
          {canGoLeft && (
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ChevronLeft size={32} className="text-white drop-shadow-lg" />
            </motion.div>
          )}
          {canGoRight && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ChevronRight size={32} className="text-white drop-shadow-lg" />
            </motion.div>
          )}
        </>
      )}
      
      {children}
    </motion.div>
  );
};

// Edge Swipe Navigation
export const EdgeSwipeNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [showIndicator, setShowIndicator] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    const edgeThreshold = 20; // pixels from edge

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;

      // Check if touch started near edges
      if (touchStartX < edgeThreshold || touchStartX > window.innerWidth - edgeThreshold) {
        setShowIndicator(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = touchX - touchStartX;
      const deltaY = touchY - touchStartY;

      // Only process horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (touchStartX < edgeThreshold && deltaX > 50) {
          setSwipeDirection('right');
        } else if (touchStartX > window.innerWidth - edgeThreshold && deltaX < -50) {
          setSwipeDirection('left');
        }
      }
    };

    const handleTouchEnd = () => {
      if (swipeDirection === 'right') {
        haptics.tap();
        navigate(-1); // Go back
      } else if (swipeDirection === 'left') {
        // Handle forward navigation or open menu
        haptics.tap();
      }

      setShowIndicator(false);
      setSwipeDirection(null);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate, swipeDirection]);

  return (
    <>
      {showIndicator && (
        <motion.div
          className={`fixed top-1/2 -translate-y-1/2 ${
            swipeDirection === 'right' ? 'left-0' : 'right-0'
          }`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="w-12 h-24 bg-primary-500/20 backdrop-blur-lg rounded-r-full" />
        </motion.div>
      )}
    </>
  );
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

// Pull to Refresh with Better Visuals
export const PullToRefresh: React.FC<{
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}> = ({ onRefresh, children }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);
  
  const handleDragEnd = async () => {
    if (pullDistance > 80) {
      haptics.success();
      await onRefresh();
    }
    setPullDistance(0);
    setIsPulling(false);
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 150 }}
      dragElastic={0.5}
      onDrag={(_, info) => {
        if (info.offset.y > 0) {
          setPullDistance(info.offset.y);
          setIsPulling(true);
        }
      }}
      onDragEnd={handleDragEnd}
      style={{ y }}
    >
      {isPulling && (
        <motion.div
          className="absolute top-0 left-0 right-0 flex justify-center items-center"
          style={{ height: pullDistance, opacity: pullDistance / 100 }}
        >
          <motion.div
            animate={{ rotate: pullDistance * 3 }}
            className="w-10 h-10 rounded-full border-4 border-primary-500 border-t-transparent"
          />
        </motion.div>
      )}
      {children}
    </motion.div>
  );
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