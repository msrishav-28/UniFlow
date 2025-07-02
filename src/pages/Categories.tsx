import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PremiumVerticalFeed from '../components/features/PremiumVerticalFeed';
import { useStore } from '../store/useStore';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Category Header */}
      <motion.div
        className="glass-surface-elevated border-b border-border-primary pt-12 pb-3 px-5"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide py-2">
          {categories.map((category) => (
            <motion.button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-body-sm font-medium transition-all ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg'
                  : 'glass-surface text-secondary hover:text-primary'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Feed */}
      <div className="flex-1">
        <PremiumVerticalFeed items={filteredItems} />
      </div>
    </motion.div>
  );
};

export default Categories;