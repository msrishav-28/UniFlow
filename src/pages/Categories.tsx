import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PremiumVerticalFeed from '../components/features/PremiumVerticalFeed';
import { useStore } from '../store/useStore';

const Categories: React.FC = () => {
  const { mediaItems, setCategory } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Events', color: 'from-gray-600 to-gray-700' },
    { value: 'technical', label: 'Technical', color: 'from-blue-500 to-blue-600' },
    { value: 'cultural', label: 'Cultural', color: 'from-purple-500 to-purple-600' },
    { value: 'guest-talks', label: 'Guest Talks', color: 'from-green-500 to-green-600' },
    { value: 'inter-college', label: 'Inter-College', color: 'from-orange-500 to-orange-600' },
    { value: 'inter-department', label: 'Inter-Dept', color: 'from-red-500 to-red-600' },
    { value: 'sports', label: 'Sports', color: 'from-yellow-500 to-yellow-600' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCategory(category);
  };

  return (
    <div className="flex flex-col h-screen bg-surface-primary">
      {/* Category Header */}
      <div className="glass-surface-elevated border-b border-border-primary pt-16 pb-4 px-5">
        <h1 className="text-2xl font-bold text-primary mb-4">Browse Events</h1>
        
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium 
                transition-all duration-200 transform
                ${selectedCategory === category.value
                  ? 'bg-gradient-to-r text-white shadow-lg scale-105'
                  : 'bg-surface-tertiary text-secondary hover:text-primary hover:bg-surface-secondary'
                }
              `}
              style={{
                backgroundImage: selectedCategory === category.value 
                  ? `linear-gradient(to right, var(--tw-gradient-stops))`
                  : undefined,
                '--tw-gradient-from': selectedCategory === category.value 
                  ? category.color.split(' ')[1] 
                  : undefined,
                '--tw-gradient-to': selectedCategory === category.value 
                  ? category.color.split(' ')[3] 
                  : undefined,
              } as React.CSSProperties}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-hidden">
        {filteredItems.length > 0 ? (
          <PremiumVerticalFeed items={filteredItems} />
        ) : (
          <div className="flex items-center justify-center h-full px-5">
            <div className="text-center">
              <div className="w-20 h-20 bg-surface-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">No Events Found</h3>
              <p className="text-sm text-secondary">
                No events in this category yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;