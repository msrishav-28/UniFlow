import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Grid3X3, Plus, Heart, User } from 'lucide-react';

const FloatingNavBar: React.FC = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/categories', icon: Grid3X3, label: 'Categories' },
    { path: '/add', icon: Plus, label: 'Add', isCenter: true },
    { path: '/saved', icon: Heart, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <motion.nav 
      className="fixed bottom-6 left-4 right-4 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="glass-nav rounded-3xl px-4 py-3 mx-auto max-w-sm">
        <div className="flex justify-around items-center">
          {navItems.map(({ path, icon: Icon, label, isCenter }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center transition-all duration-300
                ${isCenter 
                  ? 'p-4 -mt-6 rounded-2xl gradient-primary shadow-lg glow-primary' 
                  : 'p-3 rounded-xl'
                }
                ${isActive && !isCenter
                  ? 'bg-white/20 text-white' 
                  : isCenter
                  ? 'text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <Icon 
                    size={isCenter ? 24 : 20} 
                    className={`mb-1 ${isActive && !isCenter ? 'text-white' : ''}`} 
                  />
                  <span className={`text-xs font-medium ${isCenter ? 'text-white' : ''}`}>
                    {label}
                  </span>
                  
                  {isActive && !isCenter && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default FloatingNavBar;