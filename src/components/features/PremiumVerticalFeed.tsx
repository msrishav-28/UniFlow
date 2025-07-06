import React, { useEffect, useRef, useState, useCallback, memo, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff, Heart, Share2, Calendar, MapPin, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useViewportLoader } from '../../hooks/useViewportLoader';
import { haptics } from '../../utils/hapticFeedback';
import { FeedSkeleton } from '../ui/Skeleton';
import { ProgressiveImage } from '../ui/ProgressiveImage';
import { LazyPDFViewer } from '../../utils/lazyComponents';

// PDF Loading Skeleton
const PDFSkeleton = () => (
  <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 skeleton-loader flex items-center justify-center">
    <motion.div
      className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    />
  </div>
);

// Premium FeedItem Component
interface FeedItemProps {
  item: any;
  isActive: boolean;
  onBookmark: (id: string) => void;
  onShare: (item: any) => void;
  onEngagement: (id: string, time: number) => void;
}

const PremiumFeedItem = memo<FeedItemProps>(({ 
  item, 
  isActive, 
  onBookmark, 
  onShare, 
  onEngagement 
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const { hasBeenInViewport } = useViewportLoader(itemRef, {
    rootMargin: '100px'
  });
  
  const [showInfo, setShowInfo] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `In ${diffDays} days`;
    return 'Past event';
  };

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, string> = {
      technical: 'bg-blue-500',
      cultural: 'bg-purple-500',
      'guest-talks': 'bg-green-500',
      'inter-college': 'bg-orange-500',
      'inter-department': 'bg-red-500',
      sports: 'bg-yellow-500'
    };
    return styles[category] || 'bg-gray-500';
  };

  const handleBookmarkClick = () => {
    haptics.tap();
    onBookmark(item.id);
  };

  const handleShareClick = () => {
    haptics.tap();
    onShare(item);
  };

  const handleInfoClick = () => {
    haptics.tap();
    setShowDetails(true);
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
        {item.type === 'pdf' ? (
          <Suspense fallback={<PDFSkeleton />}>
            <LazyPDFViewer
              pdfUrl={item.mediaUrl}
              title={item.eventTitle || 'Event Brochure'}
              pageCount={item.pageCount || 1}
              coverImage={item.coverImage}
              isActive={isActive}
              onEngagement={(time: number) => onEngagement(item.id, time)}
            />
          </Suspense>
        ) : item.type === 'video' && hasBeenInViewport ? (
          <video
            src={item.mediaUrl}
            className="w-full h-full object-cover"
            autoPlay={isActive}
            muted
            loop
            playsInline
          />
        ) : (
          hasBeenInViewport && (
            <ProgressiveImage
              src={item.mediaUrl}
              alt={item.eventTitle || 'Event media'}
              className="w-full h-full object-cover"
            />
          )
        )}
        
        {/* Loading state if not in viewport */}
        {!hasBeenInViewport && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 skeleton-loader" />
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
        <div className={`${getCategoryStyle(item.category)} px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg`}>
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
          onClick={handleBookmarkClick}
        >
          <motion.div
            animate={item.isBookmarked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={24}
              className={`transition-colors ${
                item.isBookmarked ? 'text-red-500 fill-current' : 'text-white'
              }`}
            />
          </motion.div>
          
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
          onClick={handleShareClick}
        >
          <Share2 size={20} className="text-white" />
        </motion.button>

        {/* Info Button */}
        <motion.button
          className="glass-surface-elevated w-14 h-14 rounded-2xl flex items-center justify-center"
          whileTap={{ scale: 0.85 }}
          onClick={handleInfoClick}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 14V9M10 6V6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
        {showInfo && item.eventTitle && (
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
                <h2 className="text-2xl font-bold text-white mb-1">
                  {item.eventTitle}
                </h2>
                <p className="text-sm text-white/80 flex items-center flex-wrap gap-2">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1.5" />
                    {formatDate(item.eventDate)}
                  </span>
                  {item.location && (
                    <>
                      <span className="text-white/40">•</span>
                      <span className="flex items-center">
                        <MapPin size={14} className="mr-1.5" />
                        {item.location}
                      </span>
                    </>
                  )}
                </p>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-white/70 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag: string, index: number) => (
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
                    <p className="text-xs text-white/60">Organized by</p>
                    <p className="text-sm text-white font-medium">{item.organizer}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Info Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              className="glass-surface-elevated w-full max-h-[70vh] rounded-t-3xl overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4" />
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  {item.eventTitle}
                </h2>
                
                {item.description && (
                  <p className="text-base text-white/80 leading-relaxed">
                    {item.description}
                  </p>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center text-white/80">
                    <Calendar size={20} className="mr-3 text-white/60" />
                    <div>
                      <p className="text-base font-medium">{formatDate(item.eventDate)}</p>
                      <p className="text-sm text-white/60">
                        {new Date(item.eventDate).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {item.location && (
                    <div className="flex items-center text-white/80">
                      <MapPin size={20} className="mr-3 text-white/60" />
                      <div>
                        <p className="text-base font-medium">{item.location}</p>
                        <p className="text-sm text-white/60">Venue</p>
                      </div>
                    </div>
                  )}
                  
                  {item.organizer && (
                    <div className="flex items-center text-white/80">
                      <Users size={20} className="mr-3 text-white/60" />
                      <div>
                        <p className="text-base font-medium">{item.organizer}</p>
                        <p className="text-sm text-white/60">Organizer</p>
                      </div>
                    </div>
                  )}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-white/60 mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="glass-button px-3 py-1 text-sm text-white/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      haptics.tap();
                      handleBookmarkClick();
                    }}
                    className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                      item.isBookmarked
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'glass-button text-white'
                    }`}
                  >
                    {item.isBookmarked ? 'Remove from Saved' : 'Save Event'}
                  </button>
                  
                  <button
                    onClick={() => {
                      haptics.tap();
                      handleShareClick();
                      setShowDetails(false);
                    }}
                    className="flex-1 btn-premium py-3"
                  >
                    Share Event
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent re-renders
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.item.isBookmarked === nextProps.item.isBookmarked
  );
});

PremiumFeedItem.displayName = 'PremiumFeedItem';

// Main VerticalFeed Component
interface PremiumVerticalFeedProps {
  items: any[];
}

const PremiumVerticalFeed: React.FC<PremiumVerticalFeedProps> = ({ items }) => {
  const { toggleBookmark, updateEngagement, refreshFeed, isLoading } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });
  const pullDistance = useMotionValue(0);
  const pullOpacity = useTransform(pullDistance, [0, 100], [0, 1]);
  const pullScale = useTransform(pullDistance, [0, 100], [0.8, 1]);

  const handleShare = useCallback(async (item: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.eventTitle || 'Check out this event!',
          text: item.description || 'Amazing event happening soon!',
          url: window.location.href
        });
        haptics.success();
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        haptics.success();
      }
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    haptics.tap();
    await refreshFeed();
    setIsRefreshing(false);
  }, [refreshFeed]);

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

  // Handle scroll with virtualization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const currentIndex = Math.round(scrollTop / windowHeight);
      
      // Update visible range with buffer
      setVisibleRange({
        start: Math.max(0, currentIndex - 1),
        end: Math.min(items.length - 1, currentIndex + 2)
      });
      
      setCurrentIndex(Math.min(Math.max(currentIndex, 0), items.length - 1));
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

  // Loading state
  if (isLoading && items.length === 0) {
    return <FeedSkeleton />;
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-primary">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          >
            <RefreshCw size={32} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-primary mb-2">No events found</h2>
          <p className="text-base text-secondary">Pull down to refresh</p>
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
              <span className="text-sm font-medium text-primary">You're offline</span>
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
          <span className="text-sm font-medium text-primary">
            {pullDistance.get() > 80 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </motion.div>
      </motion.div>

      {/* Feed Container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto smooth-scroll"
      >
        {items.map((item, index) => {
          // Only render if in visible range
          if (index < visibleRange.start || index > visibleRange.end) {
            return <div key={item.id} className="h-screen" />; // Placeholder
          }
          
          return (
            <PremiumFeedItem
              key={item.id}
              item={item}
              isActive={index === currentIndex}
              onBookmark={toggleBookmark}
              onShare={handleShare}
              onEngagement={updateEngagement}
            />
          );
        })}
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
              <motion.div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex % 5
                    ? 'w-6 bg-primary-500'
                    : 'w-1 bg-white/30'
                }`}
                animate={{
                  scale: i === currentIndex % 5 ? 1.2 : 1
                }}
              />
            ))}
          </div>
          <span className="text-xs text-white font-medium">
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