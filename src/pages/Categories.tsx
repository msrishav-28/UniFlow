import React, { useState } from 'react';
import VerticalFeed from '../components/Feed/VerticalFeed';
import { useStore } from '../store/useStore';

const Categories: React.FC = () => {
  const { events } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'technical', label: 'Technical' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'guest-talks', label: 'Guest Talks' },
    { value: 'inter-college', label: 'Inter College' },
    { value: 'inter-department', label: 'Inter Dept' },
    { value: 'sports', label: 'Sports' }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  return (
    <div className="flex flex-col h-screen">
      {/* Category Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1">
        <VerticalFeed events={filteredEvents} />
      </div>
    </div>
  );
};

export default Categories;