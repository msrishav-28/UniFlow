import React from 'react';
import { motion } from 'framer-motion';

interface LoadingShimmerProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'feed';
}

const LoadingShimmer: React.FC<LoadingShimmerProps> = ({ 
  className = '', 
  variant = 'card' 
}) => {
  const variants = {
    card: 'h-64 w-full rounded-2xl',
    text: 'h-4 w-3/4 rounded',
    circle: 'h-12 w-12 rounded-full',
    feed: 'h-screen w-full'
  };

  return (
    <motion.div
      className={`skeleton ${variants[variant]} ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ 
        repeat: Infinity, 
        repeatType: 'reverse', 
        duration: 1.5 
      }}
    />
  );
};

export default LoadingShimmer;