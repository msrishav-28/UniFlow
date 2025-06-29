import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import VerticalFeed from '../components/features/VerticalFeed';
import { useStore } from '../store/useStore';

const Home: React.FC = () => {
  const { mediaItems, cleanupOldItems } = useStore();

  useEffect(() => {
    cleanupOldItems();
  }, [cleanupOldItems]);

  // Sort items by engagement and recency for better algorithm
  const sortedItems = [...mediaItems].sort((a, b) => {
    const aScore = a.viewCount * 0.3 + a.engagementTime * 0.7;
    const bScore = b.viewCount * 0.3 + b.engagementTime * 0.7;
    
    if (aScore === bScore) {
      return b.uploadedAt - a.uploadedAt; // More recent first
    }
    
    return bScore - aScore; // Higher engagement first
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <VerticalFeed items={sortedItems} />
    </motion.div>
  );
};

export default Home;