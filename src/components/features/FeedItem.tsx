import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Share2, Info } from 'lucide-react';
import { MediaItem } from '../../types';
import MediaViewer from './MediaViewer';
import AnimatedHeart from '../ui/AnimatedHeart';
import GlassCard from '../ui/GlassCard';

interface FeedItemProps {
  item: MediaItem;
  isActive: boolean;
  onBookmark: (id: string) => void;
  onShare: (item: MediaItem) => void;
  onEngagement: (id: string, time: number) => void;
}

const FeedItem: React.FC<FeedItemProps> = ({
  item,
  isActive,
  onBookmark,
  onShare,
  onEngagement
}) => {
  const [showInfo, setShowInfo] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowInfo(true);
      const timer = setTimeout(() => setShowInfo(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

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

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      technical: '🚀',
      cultural: '🎭',
      'guest-talks': '🎤',
      'inter-college': '🏆',
      'inter-department': '⚔️',
      sports: '💪'
    };
    return emojis[category as keyof typeof emojis] || '📅';
  };

  return (
    <motion.div 
      className="relative w-full h-screen flex-shrink-0 snap-start snap-always bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Media Content */}
      <MediaViewer
        item={item}
        isActive={isActive}
        onEngagement={(time) => onEngagement(item.id, time)}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-overlay pointer-events-none" />

      {/* Category Badge */}
      <motion.div
        className="absolute top-6 left-4 z-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className={`bg-gradient-to-r ${getCategoryColor(item.category)} px-3 py-1 rounded-full backdrop-blur-sm`}>
          <span className="text-white text-xs font-semibold flex items-center">
            <span className="mr-1">{getCategoryEmoji(item.category)}</span>
            {item.category.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="absolute bottom-32 right-4 z-10 space-y-4"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Bookmark Button */}
        <GlassCard className="p-3">
          <AnimatedHeart
            isLiked={item.isBookmarked}
            onToggle={() => onBookmark(item.id)}
            size={24}
          />
        </GlassCard>

        {/* Share Button */}
        <motion.button
          className="glass-card p-3 rounded-2xl"
          whileTap={{ scale: 0.9 }}
          onClick={() => onShare(item)}
        >
          <Share2 size={24} className="text-white/80" />
        </motion.button>

        {/* Info Button */}
        <motion.button
          className="glass-card p-3 rounded-2xl"
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowDetails(true)}
        >
          <Info size={24} className="text-white/80" />
        </motion.button>

        {/* View Count */}
        <div className="glass-card px-2 py-1 rounded-full">
          <span className="text-white/80 text-xs font-medium">
            {item.viewCount > 1000 
              ? `${(item.viewCount / 1000).toFixed(1)}K` 
              : item.viewCount
            }
          </span>
        </div>
      </motion.div>

      {/* Event Info Overlay */}
      <AnimatePresence>
        {showInfo && item.eventTitle && (
          <motion.div
            className="absolute bottom-6 left-4 right-20 z-10"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => setShowInfo(!showInfo)}
          >
            <GlassCard className="p-4">
              <h3 className="text-white text-xl font-bold mb-2">
                {item.eventTitle}
              </h3>
              
              {item.description && (
                <p className="text-white/90 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
              
              <div className="flex items-center text-white/80 text-sm space-x-4">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(item.eventDate)}</span>
                </div>
                
                {item.location && (
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                )}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white/20 px-2 py-1 rounded-full text-xs text-white/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </GlassCard>
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
              className="bg-white/10 backdrop-blur-lg w-full max-h-[70vh] rounded-t-3xl overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4" />
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  {item.eventTitle}
                </h2>
                
                {item.description && (
                  <p className="text-white/80 text-base leading-relaxed">
                    {item.description}
                  </p>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center text-white/80">
                    <Calendar size={20} className="mr-3" />
                    <span>{formatDate(item.eventDate)}</span>
                  </div>
                  
                  {item.location && (
                    <div className="flex items-center text-white/80">
                      <MapPin size={20} className="mr-3" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  
                  {item.organizer && (
                    <div className="flex items-center text-white/80">
                      <Users size={20} className="mr-3" />
                      <span>{item.organizer}</span>
                    </div>
                  )}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white/20 px-3 py-1 rounded-full text-sm text-white/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FeedItem;