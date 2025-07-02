import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRef } from 'react';
import { useViewportLoader } from '../../hooks/useViewportLoader';
import { getOptimizedUrl } from '../../utils/imageOptimizer';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
// Import your store at the top
import { useStore } from '../../store/useStore';
import { haptics } from '../../utils/hapticFeedback';
import { FeedSkeleton } from '../ui/Skeleton';
import { ProgressiveImage } from '../ui/ProgressiveImage';

// Premium FeedItem Component
const PremiumFeedItem = ({ item, isActive, onBookmark, onShare, onEngagement }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const { hasBeenInViewport } = useViewportLoader(itemRef, {
    rootMargin: '100px' // Preload items 100px before they enter viewport
  });
  const [showInfo, setShowInfo] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Auto-hide info after 4 seconds
  useEffect(() => {
    if (isActive) {
      setShowInfo(true);
      const timer = setTimeout(() => setShowInfo(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Track engagement
  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
    } else if (startTimeRef.current) {
      const timeSpent = (Date.now() - startTimeRef.current) / 1000;
      onEngagement(item.id, timeSpent);
    }
  }, [isActive, item.id, onEngagement]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `In ${diffDays} days`;
    return 'Past event';
  };

  const getCategoryStyle = (category) => {
    const styles = {
      technical: 'bg-gradient-to-r from-blue-500 to-blue-600',
      cultural: 'bg-gradient-to-r from-purple-500 to-pink-500',
      'guest-talks': 'bg-gradient-to-r from-emerald-500 to-teal-500',
      'inter-college': 'bg-gradient-to-r from-orange-500 to-red-500',
      'inter-department': 'bg-gradient-to-r from-rose-500 to-pink-500',
      sports: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    };
    return styles[category] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  return (
    <motion.div 
      ref={itemRef}
      className="media-container relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Media Content */}
      <div className="absolute inset-0">
        {item.type === 'video' ? (
          <video
            src={item.mediaUrl}
            className="w-full h-full object-cover"
            autoPlay={isActive}
            muted
            loop
            playsInline
          />
        ) : (
          <>
            {item.type === 'image' && hasBeenInViewport && (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 skeleton-loader" />
                )}
                <img
                  src={getOptimizedUrl(item.mediaUrl)}
                  alt={item.eventTitle}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  loading="lazy"
                  decoding="async"
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Premium Gradient Overlay */}
      <div className="media-gradient-overlay" />

      {/* Category Badge - Top Left */}
      <motion.div
        className="absolute top-6 left-5 z-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
      >
        <div className={`${getCategoryStyle(item.category)} px-4 py-2 rounded-full flex items-center space-x-2`}>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-xs font-semibold tracking-wide uppercase">
            {item.category.replace('-', ' ')}
          </span>
        </div>
      </motion.div>

      {/* Action Buttons - Right Side */}
      <motion.div
        className="absolute bottom-32 right-5 z-10 space-y-5"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
      >
        {/* Heart/Bookmark Button */}
        <motion.button
          className="glass-surface-elevated w-14 h-14 rounded-2xl flex items-center justify-center group"
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            haptics.tap();
            onBookmark(item.id);
          }}
        >
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={item.isBookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-colors ${
              item.isBookmarked ? 'text-red-500' : 'text-white'
            }`}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </motion.svg>
          {item.isBookmarked && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)'
              }}
            />
          )}
        </motion.button>

        {/* Share Button */}
        <motion.button
          className="glass-surface-elevated w-14 h-14 rounded-2xl flex items-center justify-center"
          whileTap={{ scale: 0.85 }}
          onClick={() => onShare(item)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <path d="M4 12v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-6M10 2v12M10 2L6 6M10 2l4 4" />
          </svg>
        </motion.button>

        {/* View Count */}
        <div className="glass-surface px-3 py-2 rounded-xl">
          <p className="text-white text-xs font-medium text-center">
            {item.viewCount > 999 ? `${(item.viewCount/1000).toFixed(1)}K` : item.viewCount}
          </p>
        </div>
      </motion.div>

      {/* Event Info - Bottom */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="absolute bottom-6 left-5 right-5 z-10"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => setShowInfo(!showInfo)}
          >
            <div className="glass-surface-elevated p-5 space-y-3">
              {/* Title & Date */}
              <div>
                <h2 className="text-heading-2 text-white mb-1">
                  {item.eventTitle}
                </h2>
                <p className="text-body-sm text-white/80 flex items-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="mr-2">
                    <rect x="2" y="3" width="10" height="9" rx="1" />
                    <path d="M2 6h10M5 1v2M9 1v2" />
                  </svg>
                  {formatDate(item.eventDate)}
                  {item.location && (
                    <>
                      <span className="mx-2 text-white/40">•</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="mr-1">
                        <path d="M7 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                        <path d="M7 1a5 5 0 0 0-5 5c0 4 5 7 5 7s5-3 5-7a5 5 0 0 0-5-5z" />
                      </svg>
                      {item.location}
                    </>
                  )}
                </p>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-body-sm text-white/70 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="glass-button px-3 py-1 text-xs text-white/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Organizer */}
              {item.organizer && (
                <div className="flex items-center pt-2 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-semibold">
                      {item.organizer.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-caption text-white/60">Organized by</p>
                    <p className="text-body-sm text-white font-medium">{item.organizer}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main VerticalFeed Component
const PremiumVerticalFeed = ({ items, isLoading }) => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const pullDistance = useMotionValue(0);
  const pullOpacity = useTransform(pullDistance, [0, 100], [0, 1]);
  const pullScale = useTransform(pullDistance, [0, 100], [0.8, 1]);

  // Use store functions
  const { toggleBookmark, updateEngagement, refreshFeed } = useStore();

  const handleShare = async (item) => {
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
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } else {
        alert('Sharing not supported');
      }
    }
  };

  // Refresh feed function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFeed();
    setIsRefreshing(false);
  };

  // Handle online/offline
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

  // Handle scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const index = Math.round(scrollTop / windowHeight);
      setCurrentIndex(Math.min(Math.max(index, 0), items.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  // Pull to refresh
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      if (container.scrollTop === 0) {
        startY = e.touches[0].clientY;
        isDragging = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging || container.scrollTop > 0) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, (currentY - startY) * 0.5);
      
      if (distance > 0) {
        e.preventDefault();
        pullDistance.set(Math.min(distance, 120));
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance.get() > 80) {
        await handleRefresh();
      }
      pullDistance.set(0);
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
  }, [pullDistance, handleRefresh]);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-primary">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <RefreshCw size={32} className="text-white" />
          </div>
          <h2 className="text-heading-2 text-primary mb-2">No events found</h2>
          <p className="text-body text-secondary">Pull down to refresh</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-surface-primary">
      {/* Network Status */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            className="fixed top-5 left-5 right-5 z-50 glass-surface-elevated p-4 rounded-2xl"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <div className="flex items-center justify-center">
              <WifiOff size={18} className="text-error mr-2" />
              <span className="text-body-sm font-medium text-primary">You're offline</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pull to Refresh */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none"
        style={{ 
          height: pullDistance,
          opacity: pullOpacity
        }}
      >
        <motion.div
          className="glass-surface-elevated px-6 py-3 rounded-full flex items-center"
          style={{ scale: pullScale }}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ repeat: isRefreshing ? Infinity : 0, duration: 1 }}
          >
            <RefreshCw size={18} className="text-primary mr-2" />
          </motion.div>
          <span className="text-body-sm font-medium text-primary">
            {pullDistance.get() > 80 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </motion.div>
      </motion.div>

      {/* Feed Container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto smooth-scroll"
      >
        {items.map((item, index) => (
          <PremiumFeedItem
            key={item.id}
            item={item}
            isActive={index === currentIndex}
            onBookmark={toggleBookmark}
            onShare={handleShare}
            onEngagement={updateEngagement}
          />
        ))}
      </div>

      {/* Progress Indicator */}
      <motion.div
        className="fixed bottom-28 right-5 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="glass-surface-elevated px-4 py-2 rounded-full flex items-center space-x-3">
          <div className="flex space-x-1">
            {[...Array(Math.min(items.length, 5))].map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex % 5
                    ? 'w-6 bg-primary-500'
                    : 'w-1 bg-white/30'
                }`}
              />
            ))}
          </div>
          <span className="text-caption text-white font-medium">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
      </motion.div>

      {/* Connection Indicator */}
      <motion.div
        className="fixed bottom-28 left-5 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="glass-surface p-3 rounded-xl">
          <Wifi size={16} className={isOnline ? 'text-success' : 'text-error'} />
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumVerticalFeed;