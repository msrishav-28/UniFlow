import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import EventPoster from '../EventPoster/EventPoster';
import { Event } from '../../types';
import { useStore } from '../../store/useStore';

interface VerticalFeedProps {
  events: Event[];
}

const VerticalFeed: React.FC<VerticalFeedProps> = ({ events }) => {
  const { refreshEvents } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

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
          setCurrentIndex(Math.min(Math.max(index, 0), events.length - 1));
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [events.length]);

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
        setPullDistance(Math.min(distance, 100));
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > 60) {
        setIsRefreshing(true);
        refreshEvents();
        setTimeout(() => {
          setIsRefreshing(false);
        }, 1000);
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
  }, [pullDistance, refreshEvents]);

  if (events.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <RefreshCw size={24} />
          </div>
          <p className="text-lg font-medium mb-2">No events found</p>
          <p className="text-white/70 text-sm">Pull down to refresh</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-blue-500 text-white transition-all duration-200"
          style={{ 
            height: `${pullDistance}px`,
            transform: `translateY(-${100 - pullDistance}px)`
          }}
        >
          <RefreshCw 
            size={20} 
            className={`${isRefreshing ? 'animate-spin' : ''} ${pullDistance > 60 ? 'text-white' : 'text-white/70'}`} 
          />
          <span className="ml-2 font-medium text-sm">
            {pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}

      {/* Feed Container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {events.map((event, index) => (
          <EventPoster
            key={event.id}
            event={event}
            isActive={index === currentIndex}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div className="fixed bottom-20 right-4 z-40">
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white text-xs font-medium">
            {currentIndex + 1} / {events.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerticalFeed;