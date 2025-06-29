import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
  blur?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  animate?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'light',
  blur = 'md',
  onClick,
  animate = true
}) => {
  const baseClasses = variant === 'light' ? 'glass-card' : 'glass-card-dark';
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  };

  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${blurClasses[blur]} ${className}`}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </Component>
  );
};

export default GlassCard;