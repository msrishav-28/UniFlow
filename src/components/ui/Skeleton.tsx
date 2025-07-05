// src/components/ui/Skeleton.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  animation?: 'pulse' | 'wave';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height
}) => {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-2xl'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-loader'
  };

  return (
    <div
      className={`
        bg-surface-tertiary
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={{ width, height }}
    />
  );
};

// Feed Skeleton Component
export const FeedSkeleton: React.FC = () => {
  return (
    <div className="h-screen bg-surface-primary">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Media Skeleton */}
        <Skeleton variant="rectangular" className="w-full h-screen" />
        
        {/* Content Overlay Skeleton */}
        <div className="absolute bottom-6 left-5 right-5 space-y-3">
          <div className="glass-surface p-5 rounded-2xl space-y-3">
            <Skeleton variant="text" height={28} width="70%" />
            <Skeleton variant="text" height={20} width="100%" />
            <Skeleton variant="text" height={20} width="80%" />
            
            <div className="flex items-center space-x-3 pt-3">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" height={14} width="40%" />
                <Skeleton variant="text" height={16} width="60%" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons Skeleton */}
        <div className="absolute bottom-32 right-5 space-y-5">
          <Skeleton variant="rectangular" width={56} height={56} className="rounded-2xl" />
          <Skeleton variant="rectangular" width={56} height={56} className="rounded-2xl" />
          <Skeleton variant="rectangular" width={56} height={40} className="rounded-xl" />
        </div>
      </motion.div>
    </div>
  );
};