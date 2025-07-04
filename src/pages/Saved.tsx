import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import { pageVariants, fadeInUp, staggerChildren } from '../utils/animations';
import { haptics } from '../utils/hapticFeedback';

const Saved: React.FC = () => {
  const { mediaItems, toggleBookmark } = useStore();
  const savedItems = mediaItems.filter(item => item.isBookmarked);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleUnbookmark = (id: string) => {
    haptics.tap();
    toggleBookmark(id);
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
            Start exploring and tap the heart icon to save your favorite events! ✨
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-surface-primary pt-12 pb-24"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <motion.div
        className="px-5 mb-6"
        variants={fadeInUp}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 text-primary mb-2">
              Saved Events
            </h1>
            <p className="text-body text-secondary">
              Your collection of {savedItems.length} favorite events
            </p>
          </div>
          
          <motion.div 
            className="glass-surface-elevated px-5 py-3 rounded-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-heading-3 text-primary font-bold">
              {savedItems.length}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Events Grid */}
      <motion.div 
        className="px-5 space-y-4"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence mode="popLayout">
          {savedItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { delay: index * 0.05 }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              whileHover={{ y: -2 }}
              className="card-premium overflow-hidden"
            >
              <div className="flex">
                {/* Media Preview */}
                <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                  {item.type === 'video' ? (
                    <video
                      src={item.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                    />
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
                      px-2 py-1 rounded-lg text-xs font-semibold text-white
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
                      onClick={() => handleUnbookmark(item.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      whileTap={{ scale: 0.85 }}
                    >
                      <Heart size={20} className="text-red-500 fill-current" />
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
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Saved;