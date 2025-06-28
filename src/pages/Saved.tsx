import React from 'react';
import { Heart, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Event } from '../types';

const Saved: React.FC = () => {
  const { events, user, toggleBookmark } = useStore();
  const savedEvents = events.filter(event => event.isBookmarked);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (savedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-slate-900 px-6 pb-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={24} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Saved Events
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">
            Start exploring events and tap the heart icon to save your favorites
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Saved Events
          </h1>
          <div className="bg-red-100 dark:bg-red-950 px-3 py-1 rounded-full">
            <span className="text-red-600 dark:text-red-400 text-sm font-medium">
              {savedEvents.length} saved
            </span>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {savedEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onToggleBookmark={() => toggleBookmark(event.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface EventCardProps {
  event: Event;
  onToggleBookmark: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onToggleBookmark }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[3/4]">
        <img
          src={event.posterUrl}
          alt={event.title || 'Event poster'}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        
        {/* Fallback */}
        <div className="hidden absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <div className="text-center text-white/70">
            <Calendar size={24} className="mx-auto mb-2" />
            <p className="text-xs font-medium">{event.title}</p>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <div className={`${getCategoryColor(event.category)} px-2 py-1 rounded-md`}>
            <span className="text-white text-xs font-semibold capitalize">
              {event.category.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={onToggleBookmark}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
        >
          <Heart size={16} className="fill-current" />
        </button>

        {/* Date Badge */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
          <span className="text-white text-xs font-medium">
            {formatDate(event.eventDate)}
          </span>
        </div>
      </div>

      {/* Event Info */}
      {event.title && (
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Saved;