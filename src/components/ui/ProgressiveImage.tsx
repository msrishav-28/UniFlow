// src/components/ui/ProgressiveImage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedUrl } from '../../utils/imageOptimizer';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  thumbnailWidth?: number;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  onLoad,
  thumbnailWidth = 50
}) => {
  const [imgSrc, setImgSrc] = useState(getOptimizedUrl(src, thumbnailWidth));
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = getOptimizedUrl(src);
    img.onload = () => {
      setImgSrc(getOptimizedUrl(src));
      setIsHighResLoaded(true);
      onLoad?.();
    };
  }, [src, onLoad]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 skeleton-loader" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.img
        src={imgSrc}
        alt={alt}
        className={`${className} ${!isHighResLoaded ? 'filter blur-sm' : ''}`}
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};