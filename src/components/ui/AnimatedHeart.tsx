import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface AnimatedHeartProps {
  isLiked: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
}

const AnimatedHeart: React.FC<AnimatedHeartProps> = ({
  isLiked,
  onToggle,
  size = 24,
  className = ''
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClick = () => {
    onToggle();
    if (!isLiked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 600);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative ${className}`}
      whileTap={{ scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={size}
          className={`transition-colors duration-200 ${
            isLiked 
              ? 'fill-red-500 text-red-500' 
              : 'text-white/80 hover:text-white'
          }`}
        />
      </motion.div>

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full"
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  rotate: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: Math.cos(i * 45 * Math.PI / 180) * 30,
                  y: Math.sin(i * 45 * Math.PI / 180) * 30,
                  rotate: 180
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.6,
                  ease: 'easeOut'
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AnimatedHeart;