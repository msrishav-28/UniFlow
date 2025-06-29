import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import GlassCard from '../components/ui/GlassCard';
import AnimatedHeart from '../components/ui/AnimatedHeart';

const Saved: React.FC = () => {
  const { mediaItems, toggleBookmark } = useStore();
  const savedItems = mediaItems.filter(item => item.isBookmarked);

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

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: 'from-blue-500 to-purple-600',
      cultural: 'from-purple-500 to-pink-600',
      'guest-talks': 'from-green-500 to-teal-600',
      'inter-college': 'from-orange-500 to-red-600',
      'inter-department': 'from-red-500 to-pink-600',
      sports: 'from-yellow-500 to-orange-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  if (savedItems.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            No Saved Events Yet
          </h2>
          <p className="text-white/70 text-base max-w-xs leading-relaxed">
            Start exploring events and tap the heart icon to save your favorites! ✨
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-12 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="px-4 mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Saved Events 💖
            </h1>
            <p className="text-white/70">Your favorite events collection</p>
          </div>
          <GlassCard className="px-4 py-2">
            <span className="text-white font-medium">
              {savedItems.length} saved
            </span>
          </GlassCard>
        </div>
      </motion.div>

      {/* Events Grid */}
      <div className="px-4">
        <div className="grid grid-cols-1 gap-4">
          {savedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <EventCard 
                item={item} 
                onToggleBookmark={() => toggleBookmark(item.id)}
                formatDate={formatDate}
                getCategoryColor={getCategoryColor}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface EventCardProps {
  item: any;
  onToggleBookmark: () => void;
  formatDate: (date: string) => string;
  getCategoryColor: (category: string) => string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  item, 
  onToggleBookmark, 
  formatDate, 
  getCategoryColor 
}) => {
  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="flex">
        {/* Media Preview */}
        <div className="relative w-24 h-24 flex-shrink-0">
          {item.type === 'video' ? (
            <video
              src={item.mediaUrl}
              className="w-full h-full object-cover"
              muted
            />
          ) : (
            <img
              src={item.mediaUrl}
              alt={item.eventTitle || 'Event media'}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          )}
          
          {/* Fallback */}
          <div className="hidden absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <Calendar size={16} className="text-white/70" />
          </div>

          {/* Category Badge */}
          <div className="absolute top-1 left-1">
            <div className={`bg-gradient-to-r ${getCategoryColor(item.category)} px-1.5 py-0.5 rounded-md`}>
              <span className="text-white text-xs font-semibold">
                {item.category.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-white text-base line-clamp-1 flex-1 mr-2">
              {item.eventTitle}
            </h3>
            <AnimatedHeart
              isLiked={item.isBookmarked}
              onToggle={onToggleBookmark}
              size={20}
            />
          </div>
          
          {item.description && (
            <p className="text-white/70 text-sm line-clamp-2 mb-3">
              {item.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-white/60 text-xs">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>{formatDate(item.eventDate)}</span>
            </div>
            
            {item.location && (
              <div className="flex items-center">
                <MapPin size={12} className="mr-1" />
                <span className="line-clamp-1 max-w-20">{item.location}</span>
              </div>
            )}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 2).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default Saved;