import React, { useState } from 'react';
import { Heart, Calendar, Tag } from 'lucide-react';
import { Event } from '../../types';
import { useStore } from '../../store/useStore';

interface EventPosterProps {
  event: Event;
  isActive?: boolean;
}

const EventPoster: React.FC<EventPosterProps> = ({ event, isActive = false }) => {
  const { toggleBookmark } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: 'bg-blue-500',
      cultural: 'bg-purple-500',
      'guest-talks': 'bg-green-500',
      'inter-college': 'bg-orange-500',
      'inter-department': 'bg-red-500',
      sports: 'bg-yellow-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(event.id);
  };

  return (
    <div className="relative w-full h-screen flex-shrink-0 snap-start snap-always bg-black">
      {/* Image Container */}
      <div className="relative w-full h-full overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-white/20 rounded-lg"></div>
            </div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-white/70">
              <div className="w-16 h-16 bg-white/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Tag size={24} />
              </div>
              <p className="text-lg font-medium mb-2">{event.title || 'Event Poster'}</p>
              <p className="text-sm opacity-75">Image unavailable</p>
            </div>
          </div>
        ) : (
          <img
            src={event.posterUrl}
            alt={event.title || 'Event poster'}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
            loading={isActive ? 'eager' : 'lazy'}
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Category Badge */}
        <div className="absolute top-6 left-4 z-10">
          <div className={`${getCategoryColor(event.category)} px-3 py-1 rounded-full backdrop-blur-sm`}>
            <span className="text-white text-xs font-semibold capitalize">
              {event.category.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          className={`absolute top-6 right-4 z-10 p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
            event.isBookmarked
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <Heart 
            size={20} 
            className={event.isBookmarked ? 'fill-current' : ''} 
          />
        </button>

        {/* Event Info */}
        <div className="absolute bottom-6 left-4 right-4 z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            {event.title && (
              <h3 className="text-white text-xl font-bold mb-2">
                {event.title}
              </h3>
            )}
            
            {event.description && (
              <p className="text-white/90 text-sm mb-3 line-clamp-2">
                {event.description}
              </p>
            )}
            
            <div className="flex items-center text-white/80 text-sm">
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(event.eventDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPoster;