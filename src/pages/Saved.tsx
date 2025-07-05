import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, MapPin, Grid3x3, List, FileText, Video, Image } from 'lucide-react';
import { useStore } from '../store/useStore';
import { pageVariants, fadeInUp, staggerChildren } from '../utils/animations';
import { haptics } from '../utils/hapticFeedback';

const Saved = () => {
  const { mediaItems, toggleBookmark } = useStore();
  const savedItems = mediaItems.filter(item => item.isBookmarked);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getItemHeight = (item: any) => {
    // Create dynamic heights for masonry effect
    const heights = ['h-48', 'h-64', 'h-56', 'h-72'];
    return heights[parseInt(item.id) % heights.length];
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'pdf': return FileText;
      default: return Image;
    }
  };

  if (savedItems.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-screen bg-surface-primary px-6 pb-20"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="text-center"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
          >
            <Heart size={40} className="text-white" />
          </motion.div>
          
          <h2 className="text-heading-2 text-primary mb-3">
            No Saved Events Yet
          </h2>
          <p className="text-body text-secondary max-w-xs leading-relaxed">
            Start exploring and tap the heart icon to save your favorite events!
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-surface-primary"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Clean Header */}
      <motion.header 
        className="glass-surface-elevated sticky top-0 z-30 px-5 py-4"
        variants={fadeInUp}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 text-primary">Saved Events</h1>
            <p className="text-caption text-secondary mt-1">
              {savedItems.length} events in your collection
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <motion.div 
            className="flex items-center glass-surface rounded-xl p-1"
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => {
                haptics.tap();
                setViewMode('grid');
              }}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-tertiary hover:text-primary'
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => {
                haptics.tap();
                setViewMode('list');
              }}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-tertiary hover:text-primary'
              }`}
            >
              <List size={18} />
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* Content */}
      <motion.div 
        className="px-5 py-6 pb-24"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            /* Gallery Grid View */
            <motion.div
              key="grid"
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {savedItems.map((item, index) => {
                const MediaIcon = getMediaIcon(item.type);
                
                return (
                  <motion.div
                    key={item.id}
                    className={`relative overflow-hidden rounded-2xl glass-surface group ${getItemHeight(item)}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Media Background */}
                    <div className="absolute inset-0">
                      {item.type === 'video' ? (
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : item.type === 'pdf' ? (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                          <FileText size={48} className="text-white/20" />
                        </div>
                      ) : (
                        <img
                          src={item.mediaUrl}
                          alt={item.eventTitle}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {/* Media Type Badge */}
                      <div className="inline-flex items-center glass-surface px-2 py-1 rounded-lg mb-2">
                        <MediaIcon size={12} className="text-white mr-1" />
                        <span className="text-white text-xs font-medium capitalize">
                          {item.type}
                        </span>
                      </div>
                      
                      <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                        {item.eventTitle}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {formatDate(item.eventDate)}
                      </p>
                    </div>
                    
                    {/* Quick Actions */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        haptics.tap();
                        toggleBookmark(item.id);
                      }}
                      className="absolute top-3 right-3 p-2 glass-surface rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      whileTap={{ scale: 0.85 }}
                    >
                      <Heart size={16} className="text-red-500 fill-current" />
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* List View */
            <motion.div
              key="list"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {savedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="card-premium overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex">
                    {/* Thumbnail */}
                    <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden">
                      {item.type === 'video' ? (
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : item.type === 'pdf' ? (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                          <FileText size={32} className="text-white/50" />
                        </div>
                      ) : (
                        <img
                          src={item.mediaUrl}
                          alt={item.eventTitle}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-2 left-2">
                        <div className={`
                          px-2 py-1 rounded-lg text-xs font-semibold text-white shadow-lg
                          ${item.category === 'technical' ? 'bg-blue-500' : ''}
                          ${item.category === 'cultural' ? 'bg-purple-500' : ''}
                          ${item.category === 'guest-talks' ? 'bg-green-500' : ''}
                          ${item.category === 'inter-college' ? 'bg-orange-500' : ''}
                          ${item.category === 'inter-department' ? 'bg-red-500' : ''}
                          ${item.category === 'sports' ? 'bg-yellow-500' : ''}
                        `}>
                          {item.category.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-heading-3 text-primary line-clamp-1 flex-1 mr-2">
                          {item.eventTitle}
                        </h3>
                        
                        <motion.button
                          onClick={() => {
                            haptics.tap();
                            toggleBookmark(item.id);
                          }}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          whileTap={{ scale: 0.85 }}
                        >
                          <Heart size={18} className="text-red-500 fill-current" />
                        </motion.button>
                      </div>
                      
                      {item.description && (
                        <p className="text-body-sm text-secondary line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-caption text-tertiary">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(item.eventDate)}</span>
                        </div>
                        
                        {item.location && (
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            <span className="line-clamp-1">{item.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Saved;