import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Grid3x3, Plus, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { haptics } from '../../utils/hapticFeedback';

const PremiumNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/categories', icon: Grid3x3, label: 'Browse' },
    { path: '/add', icon: Plus, label: 'Create', isCenter: true },
    { path: '/saved', icon: Heart, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const springConfig = {
    type: 'spring',
    stiffness: 500,
    damping: 30
  };

  const handleNavigation = (path: string, isCenter?: boolean) => {
    if (currentPath !== path) {
      if (isCenter) {
        haptics.success();
      } else {
        haptics.tap();
      }
      navigate(path);
    }
  };

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={springConfig}
    >
      <div className="relative px-5 pb-5">
        {/* Glass Background */}
        <div className="glass-surface-elevated rounded-3xl overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          {/* Navigation Items */}
          <div className="relative flex items-center justify-around px-4 py-4">
            {navItems.map(({ path, icon: Icon, label, isCenter }) => {
              const isActive = currentPath === path;
              
              return (
                <motion.button
                  key={path}
                  onClick={() => handleNavigation(path, isCenter)}
                  className={`relative flex flex-col items-center justify-center transition-all ${
                    isCenter ? '-mt-8' : ''
                  }`}
                  whileTap={{ scale: 0.85 }}
                >
                  {/* Center Button Special Design */}
                  {isCenter ? (
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={springConfig}
                    >
                      {/* Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl blur-lg opacity-80" />
                      
                      {/* Button */}
                      <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon size={24} className="text-white" />
                        
                        {/* Pulse Animation */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-white"
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: 'easeOut'
                          }}
                        />
                      </div>
                      
                      {/* Label */}
                      <span className="text-caption text-primary mt-1 font-medium absolute -bottom-5 left-1/2 -translate-x-1/2">
                        {label}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="relative p-2">
                      {/* Active Indicator Background */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="navActiveBackground"
                            className="absolute inset-0 bg-primary-500/10 rounded-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={springConfig}
                          />
                        )}
                      </AnimatePresence>
                      
                      {/* Icon */}
                      <motion.div
                        animate={{
                          scale: isActive ? 1.1 : 1,
                          color: isActive ? 'var(--primary-600)' : 'var(--text-tertiary)'
                        }}
                        transition={springConfig}
                        className="relative z-10"
                      >
                        <Icon size={20} />
                      </motion.div>
                      
                      {/* Label */}
                      <motion.span
                        className={`text-caption mt-1 block transition-colors ${
                          isActive ? 'text-primary font-semibold' : 'text-tertiary font-medium'
                        }`}
                        animate={{
                          y: isActive ? 0 : 2,
                          opacity: isActive ? 1 : 0.7
                        }}
                        transition={springConfig}
                      >
                        {label}
                      </motion.span>
                      
                      {/* Active Dot Indicator */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary-600 rounded-full"
                            initial={{ scale: 0, x: '-50%' }}
                            animate={{ scale: 1, x: '-50%' }}
                            exit={{ scale: 0, x: '-50%' }}
                            transition={springConfig}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default PremiumNavigation;