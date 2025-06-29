import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VerticalFeed from '../components/features/VerticalFeed';
import CategoryPills from '../components/ui/CategoryPills';
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
      className="flex flex-col h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Category Header */}
      <motion.div
        className="glass-nav border-b border-white/10 pt-12 pb-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </motion.div>

      {/* Feed */}
      <div className="flex-1">
        <VerticalFeed items={filteredItems} />
      </div>
    </motion.div>
  );
};

export default Categories;