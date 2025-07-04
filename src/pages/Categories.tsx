import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PremiumVerticalFeed from '../components/features/PremiumVerticalFeed';
import { useStore } from '../store/useStore';
import { pageVariants, fadeInUp, staggerChildren } from '../utils/animations';

const Categories: React.FC = () => {
  const { mediaItems, setCategory } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All', emoji: '🌟' },
    { value: 'technical', label: 'Tech', emoji: '🚀' },
    { value: 'cultural', label: 'Culture', emoji: '🎭' },
    { value: 'guest-talks', label: 'Talks', emoji: '🎤' },
    { value: 'inter-college', label: 'Inter-College', emoji: '🏆' },
    { value: 'inter-department', label: 'Inter-Dept', emoji: '⚔️' },
    { value: 'sports', label: 'Sports', emoji: '💪' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCategory(category);
  };

  return (
    <motion.div
      className="flex flex-col h-screen bg-surface-primary"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Category Header */}
      <motion.div
        className="glass-surface-elevated border-b border-border-primary pt-12 pb-3 px-5"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
      >
        <motion.div 
          className="flex space-x-3 overflow-x-auto scrollbar-hide py-2"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-body-sm font-medium transition-all ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg'
                  : 'glass-surface text-secondary hover:text-primary'
              }`}
              whileTap={{ scale: 0.95 }}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.05 }
                }
              }}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.label}
              
              {selectedCategory === category.value && (
                <motion.div
                  layoutId="categoryActiveIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Feed */}
      <motion.div 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <PremiumVerticalFeed items={filteredItems} />
      </motion.div>
    </motion.div>
  );
};

export default Categories;