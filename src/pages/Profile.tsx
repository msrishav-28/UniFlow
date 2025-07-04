import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, LogOut, Bell, Moon, Sun,
  Volume2, VolumeX, Share2, Award, ChevronRight,
  Heart, Calendar, Eye
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { pageVariants, fadeInUp, scaleIn, staggerChildren } from '../utils/animations';
import { haptics } from '../utils/hapticFeedback';

interface ProfileProps {
  onToggleTheme?: () => void;
  currentTheme?: string;
}

const Profile: React.FC<ProfileProps> = ({ onToggleTheme, currentTheme = 'light' }) => {
  const { user, mediaItems } = useStore();
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(user.preferences.notifications);
  const [autoplay, setAutoplay] = useState(user.preferences.autoplay);
  
  const savedEventsCount = mediaItems.filter(item => item.isBookmarked).length;
  const totalViews = mediaItems.reduce((sum, item) => sum + item.viewCount, 0);
  const userEventsCount = mediaItems.filter(item => 
    item.uploadedAt && Date.now() - item.uploadedAt < 86400000 * 7
  ).length;

  const stats = [
    { icon: Heart, label: 'Saved', value: savedEventsCount, color: 'from-red-500 to-pink-600' },
    { icon: Calendar, label: 'Created', value: userEventsCount, color: 'from-blue-500 to-cyan-600' },
    { icon: Eye, label: 'Views', value: totalViews > 999 ? `${(totalViews/1000).toFixed(1)}K` : totalViews, color: 'from-purple-500 to-indigo-600' }
  ];

  const handleLogout = () => {
    haptics.warning();
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleShare = async () => {
    haptics.tap();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'College Events App',
          text: 'Check out this amazing college events app!',
          url: window.location.origin
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-surface-primary pt-12 pb-24"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Profile Header */}
      <motion.div
        className="px-5 mb-8"
        variants={fadeInUp}
      >
        <div className="card-premium p-6">
          <motion.div className="text-center">
            {/* Avatar */}
            <motion.div
              className="relative inline-block mb-4"
              variants={scaleIn}
              transition={{ delay: 0.2 }}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gradient-to-br from-primary-500 to-primary-700 p-0.5">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-elevated rounded-full flex items-center justify-center">
                    <User size={36} className="text-primary" />
                  </div>
                )}
              </div>
              
              {/* Online Indicator */}
              <motion.div 
                className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-3 border-surface-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              />
            </motion.div>
            
            <h1 className="text-heading-1 text-primary mb-1">{user.name}</h1>
            <p className="text-body text-secondary mb-6">{user.email}</p>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.3 + index * 0.1 }
                    }
                  }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <stat.icon size={20} className="text-white" />
                  </motion.div>
                  <p className="text-heading-3 text-primary font-bold">{stat.value}</p>
                  <p className="text-caption text-tertiary">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        className="px-5 space-y-4"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        {/* Settings */}
        <motion.div
          className="card-premium overflow-hidden"
          variants={{
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 }
          }}
        >
          <motion.button
            onClick={() => {
              haptics.tap();
              setShowSettings(!showSettings);
            }}
            className="w-full flex items-center px-5 py-4 hover:bg-surface-secondary transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center mr-4">
              <Settings size={20} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-body font-semibold text-primary">Settings</p>
              <p className="text-caption text-secondary">Preferences & controls</p>
            </div>
            <motion.div
              animate={{ rotate: showSettings ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={20} className="text-tertiary" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-border-primary"
              >
                <div className="p-5 space-y-4">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {currentTheme === 'dark' ? (
                        <Moon size={18} className="text-tertiary mr-3" />
                      ) : (
                        <Sun size={18} className="text-tertiary mr-3" />
                      )}
                      <span className="text-body text-primary">Dark Mode</span>
                    </div>
                    <motion.button
                      onClick={() => {
                        haptics.tap();
                        onToggleTheme?.();
                      }}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        currentTheme === 'dark' ? 'bg-primary-500' : 'bg-surface-tertiary'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: currentTheme === 'dark' ? 26 : 2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </motion.button>
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell size={18} className="text-tertiary mr-3" />
                      <span className="text-body text-primary">Notifications</span>
                    </div>
                    <motion.button
                      onClick={() => {
                        haptics.tap();
                        setNotifications(!notifications);
                      }}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications ? 'bg-primary-500' : 'bg-surface-tertiary'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: notifications ? 26 : 2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </motion.button>
                  </div>

                  {/* Autoplay */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {autoplay ? (
                        <Volume2 size={18} className="text-tertiary mr-3" />
                      ) : (
                        <VolumeX size={18} className="text-tertiary mr-3" />
                      )}
                      <span className="text-body text-primary">Autoplay Videos</span>
                    </div>
                    <motion.button
                      onClick={() => {
                        haptics.tap();
                        setAutoplay(!autoplay);
                      }}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        autoplay ? 'bg-primary-500' : 'bg-surface-tertiary'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: autoplay ? 26 : 2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Share App */}
        <motion.button
          onClick={handleShare}
          className="card-premium w-full flex items-center px-5 py-4 hover:bg-surface-secondary transition-colors"
          variants={{
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mr-4">
            <Share2 size={20} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-body font-semibold text-primary">Share App</p>
            <p className="text-caption text-secondary">Tell your friends!</p>
          </div>
          <ChevronRight size={20} className="text-tertiary" />
        </motion.button>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          className="card-premium w-full flex items-center px-5 py-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          variants={{
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mr-4">
            <LogOut size={20} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-body font-semibold text-error">Logout</p>
            <p className="text-caption text-error/70">Sign out of your account</p>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Profile;