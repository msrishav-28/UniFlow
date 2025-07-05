import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, LogOut, Bell, Moon, Sun,
  Volume2, VolumeX, Share2, ChevronRight,
  Heart, Eye, Grid3x3, BarChart3,
  MapPin, Award, TrendingUp
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
  const [activeTab, setActiveTab] = useState<'posts' | 'stats'>('posts');
  const [notifications, setNotifications] = useState(user.preferences.notifications);
  const [autoplay, setAutoplay] = useState(user.preferences.autoplay);
  
  // Calculate stats
  const savedEventsCount = mediaItems.filter(item => item.isBookmarked).length;
  const totalViews = mediaItems.reduce((sum, item) => sum + item.viewCount, 0);
  const userEvents = mediaItems.filter(item => 
    item.uploadedAt && Date.now() - item.uploadedAt < 86400000 * 30
  );
  const totalEngagement = mediaItems.reduce((sum, item) => sum + item.engagementTime, 0);

  const stats = [
    { icon: Grid3x3, label: 'Posts', value: userEvents.length, color: 'from-blue-500 to-cyan-600' },
    { icon: Heart, label: 'Saved', value: savedEventsCount, color: 'from-red-500 to-pink-600' },
    { icon: Eye, label: 'Views', value: totalViews > 999 ? `${(totalViews/1000).toFixed(1)}K` : totalViews, color: 'from-purple-500 to-indigo-600' },
  ];

  const detailedStats = [
    { label: 'Total Engagement Time', value: `${Math.round(totalEngagement / 60)}min`, icon: TrendingUp },
    { label: 'Average Views per Post', value: userEvents.length ? Math.round(totalViews / userEvents.length) : 0, icon: BarChart3 },
    { label: 'Most Popular Category', value: 'Technical', icon: Award },
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
      className="min-h-screen bg-surface-primary pb-24"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Profile Header */}
      <motion.div
        className="relative"
        variants={fadeInUp}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 h-48 bg-gradient-to-br from-primary-500 to-primary-700" />
        
        {/* Profile Content */}
        <div className="relative px-5 pt-12 pb-6">
          {/* Avatar */}
          <motion.div
            className="relative inline-block mb-4"
            variants={scaleIn}
            transition={{ delay: 0.2 }}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-white p-0.5">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <User size={36} className="text-white" />
                </div>
              )}
            </div>
            
            {/* Online Indicator */}
            <motion.div 
              className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            />
          </motion.div>
          
          {/* Name & Info */}
          <div className="text-center mb-6">
            <h1 className="text-heading-1 text-white mb-1">{user.name}</h1>
            <div className="flex items-center justify-center text-white/80 text-body-sm">
              <MapPin size={14} className="mr-1" />
              <span>NYC, USA</span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-3 gap-3"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass-surface-elevated rounded-2xl p-4 text-center"
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.3 + index * 0.1 }
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}
                >
                  <stat.icon size={18} className="text-white" />
                </motion.div>
                <p className="text-heading-3 text-primary font-bold">{stat.value}</p>
                <p className="text-caption text-tertiary uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="px-5 mb-6">
        <div className="flex glass-surface rounded-2xl p-1">
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('posts');
            }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'posts' 
                ? 'bg-primary-500 text-white' 
                : 'text-tertiary'
            }`}
          >
            My Posts
          </button>
          <button
            onClick={() => {
              haptics.tap();
              setActiveTab('stats');
            }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'stats' 
                ? 'bg-primary-500 text-white' 
                : 'text-tertiary'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'posts' ? (
          /* User's Posts Grid */
          <motion.div
            key="posts"
            className="px-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {userEvents.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {userEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="relative aspect-square rounded-2xl overflow-hidden glass-surface"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: { delay: index * 0.05 }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {event.type === 'video' ? (
                      <video
                        src={event.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={event.mediaUrl}
                        alt={event.eventTitle}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Overlay with stats */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-xs font-medium truncate">{event.eventTitle}</p>
                      <div className="flex items-center text-white/80 text-xs mt-1">
                        <Eye size={12} className="mr-1" />
                        <span>{event.viewCount}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Grid3x3 size={48} className="text-tertiary mx-auto mb-4" />
                <p className="text-body text-secondary">No posts yet</p>
                <p className="text-caption text-tertiary">Share your first event!</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* Analytics Tab */
          <motion.div
            key="stats"
            className="px-5 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {detailedStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card-premium p-5 flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mr-4">
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <p className="text-body text-primary">{stat.label}</p>
                </div>
                <p className="text-heading-3 font-bold text-primary">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Section */}
      <motion.div
        className="px-5 mt-8 space-y-4"
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