import React from 'react';
import { motion } from 'framer-motion';

interface CategoryPillsProps {
  categories: Array<{ value: string; label: string; emoji: string }>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex space-x-3 overflow-x-auto scrollbar-hide px-4 py-3">
      {categories.map((category) => (
        <motion.button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
            selectedCategory === category.value
              ? 'gradient-primary text-white shadow-lg glow-primary'
              : 'glass-card text-white/80 hover:text-white hover:bg-white/20'
          }`}
          whileTap={{ scale: 0.95 }}
          layout
        >
          <span className="mr-2">{category.emoji}</span>
          {category.label}
          
          {selectedCategory === category.value && (
            <motion.div
              layoutId="categoryIndicator"
              className="absolute inset-0 rounded-2xl gradient-primary"
              style={{ zIndex: -1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryPills;