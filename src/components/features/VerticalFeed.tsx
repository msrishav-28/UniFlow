import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import FeedItem from './FeedItem';
import LoadingShimmer from '../ui/LoadingShimmer';
import { MediaItem } from '../../types';
import { useStore } from '../../store/useStore';

interface VerticalFeedProps {
  items: MediaItem[];
}

const VerticalFeed: React.FC<VerticalFeedProps> = ({ items }) => {
  const { toggleBookmark, updateEngagement, refreshFeed, isLoading } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle scroll snapping
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = container.scrollTop;
          const windowHeight = window.innerHeight;
          const index = Math.round(scrollTop / windowHeight);
          setCurrentIndex(Math.min(Math.max(index, 0), items.length - 1));
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  // Pull to refresh functionality
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY = e.touches[0].clientY;
        isDragging = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || container.scrollTop > 0) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, (currentY - startY) * 0.5);
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, 120));
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 80) {
        setIsRefreshing(true);
        await refreshFeed();
        setIsRefreshing(false);
      }
      setPullDistance(0);
      isDragging = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, refreshFeed]);

  const handleShare = useCallback(async (item: MediaItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.eventTitle || 'Check out this event!',
          text: item.description || 'Amazing event happening soon!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback for browsers without Web Share API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      }
    }
  }, []);

  if (items.length === 0 && !isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <RefreshCw size={24} />
          </div>
          <p className="text-lg font-medium mb-2">No events found</p>
          <p className="text-white/70 text-sm">Pull down to refresh</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Offline Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            className="fixed top-4 left-4 right-4 z-50 glass-card p-3 rounded-2xl"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <div className="flex items-center justify-center text-white/80">
              <WifiOff size={16} className="mr-2" />
              <span className="text-sm font-medium">You're offline</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gradient-primary text-white"
            style={{ 
              height: `${pullDistance}px`,
              transform: `translateY(-${120 - pullDistance}px)`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex items-center"
              animate={{ 
                rotate: isRefreshing ? 360 : 0,
                scale: pullDistance > 80 ? 1.1 : 1
              }}
              transition={{ 
                rotate: { repeat: isRefreshing ? Infinity : 0, duration: 1 },
                scale: { type: 'spring', stiffness: 300 }
              }}
            >
              <RefreshCw size={20} className="mr-2" />
              <span className="font-medium text-sm">
                {pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="h-screen">
          <LoadingShimmer variant="feed" />
        </div>
      )}

      {/* Feed Container */}
      {!isLoading && (
        <div
          ref={containerRef}
          className="h-screen overflow-y-auto snap-container scrollbar-hide"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {items.map((item, index) => (
            <FeedItem
              key={item.id}
              item={item}
              isActive={index === currentIndex}
              onBookmark={toggleBookmark}
              onShare={handleShare}
              onEngagement={updateEngagement}
            />
          ))}
        </div>
      )}

      {/* Progress indicator */}
      {!isLoading && items.length > 0 && (
        <motion.div
          className="fixed bottom-24 right-4 z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass-card px-3 py-1 rounded-full">
            <span className="text-white text-xs font-medium">
              {currentIndex + 1} / {items.length}
            </span>
          </div>
        </motion.div>
      )}

      {/* Online Status Indicator */}
      <motion.div
        className="fixed bottom-24 left-4 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="glass-card p-2 rounded-full">
          {isOnline ? (
            <Wifi size={16} className="text-green-400" />
          ) : (
            <WifiOff size={16} className="text-red-400" />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerticalFeed;