import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import PremiumVerticalFeed from '../components/features/PremiumVerticalFeed';
import { useStore } from '../store/useStore';
import { pageVariants } from '../utils/animations';

const Home: React.FC = () => {
  const { mediaItems, cleanupOldItems } = useStore();

  useEffect(() => {
    cleanupOldItems();
  }, [cleanupOldItems]);

  const sortedItems = [...mediaItems].sort((a, b) => {
    const aScore = (a.viewCount * 0.3) + (a.engagementTime * 0.7) + (a.isBookmarked ? 100 : 0);
    const bScore = (b.viewCount * 0.3) + (b.engagementTime * 0.7) + (b.isBookmarked ? 100 : 0);
    
    if (Math.abs(aScore - bScore) < 10) {
      return b.uploadedAt - a.uploadedAt;
    }
    
    return bScore - aScore;
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <PremiumVerticalFeed items={sortedItems} />
    </motion.div>
  );
};

export default Home;