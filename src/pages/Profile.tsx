import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Heart, 
  Settings, 
  LogOut, 
  Bell,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Share2,
  Award
} from 'lucide-react';
import { useStore } from '../store/useStore';
import GlassCard from '../components/ui/GlassCard';

const Profile: React.FC = () => {
  const { user, mediaItems } = useStore();
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(user.preferences.notifications);
  const [autoplay, setAutoplay] = useState(user.preferences.autoplay);
  
  const savedEventsCount = mediaItems.filter(item => item.isBookmarked).length;
  const userEventsCount = mediaItems.filter(item => 
    item.uploadedAt && Date.now() - item.uploadedAt < 86400000 * 7
  ).length;
  const totalViews = mediaItems.reduce((sum, item) => sum + item.viewCount, 0);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? This will clear all your data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleShare = async () => {
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
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-12 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Profile Header */}
      <motion.div
        className="px-4 mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6 text-center">
          <motion.div
            className="relative inline-block mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </motion.div>
          
          <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-white/70 text-sm mb-4">{user.email}</p>
          
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{savedEventsCount}</p>
              <p className="text-white/70 text-xs">Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{userEventsCount}</p>
              <p className="text-white/70 text-xs">Shared</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{totalViews > 1000 ? `${(totalViews/1000).toFixed(1)}K` : totalViews}</p>
              <p className="text-white/70 text-xs">Views</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="px-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-3 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart size={20} className="text-red-400" />
            </div>
            <p className="text-white font-bold text-lg">{savedEventsCount}</p>
            <p className="text-white/70 text-xs">Favorites</p>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar size={20} className="text-blue-400" />
            </div>
            <p className="text-white font-bold text-lg">{userEventsCount}</p>
            <p className="text-white/70 text-xs">Created</p>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award size={20} className="text-yellow-400" />
            </div>
            <p className="text-white font-bold text-lg">{Math.floor(totalViews / 100)}</p>
            <p className="text-white/70 text-xs">Points</p>
          </GlassCard>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        className="px-4 space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Settings */}
        <GlassCard className="overflow-hidden">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center px-4 py-4 hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center mr-3">
              <Settings size={18} className="text-gray-300" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white">Settings</p>
              <p className="text-sm text-white/70">App preferences & controls</p>
            </div>
            <motion.div
              animate={{ rotate: showSettings ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Settings size={16} className="text-white/50" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-white/10"
              >
                <div className="p-4 space-y-4">
                  {/* Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell size={16} className="text-white/70 mr-3" />
                      <span className="text-white text-sm">Notifications</span>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications ? 'bg-blue-500' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: notifications ? 26 : 2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Autoplay */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {autoplay ? (
                        <Volume2 size={16} className="text-white/70 mr-3" />
                      ) : (
                        <VolumeX size={16} className="text-white/70 mr-3" />
                      )}
                      <span className="text-white text-sm">Autoplay Videos</span>
                    </div>
                    <button
                      onClick={() => setAutoplay(!autoplay)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        autoplay ? 'bg-blue-500' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: autoplay ? 26 : 2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Dark Mode */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {darkMode ? (
                        <Moon size={16} className="text-white/70 mr-3" />
                      ) : (
                        <Sun size={16} className="text-white/70 mr-3" />
                      )}
                      <span className="text-white text-sm">Dark Mode</span>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        darkMode ? 'bg-blue-500' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: darkMode ? 26 : 2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Share App */}
        <GlassCard>
          <button
            onClick={handleShare}
            className="w-full flex items-center px-4 py-4 hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
              <Share2 size={18} className="text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white">Share App</p>
              <p className="text-sm text-white/70">Tell your friends about us!</p>
            </div>
          </button>
        </GlassCard>

        {/* Logout */}
        <GlassCard>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-4 hover:bg-red-500/10 transition-colors"
          >
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
              <LogOut size={18} className="text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-red-400">Logout</p>
              <p className="text-sm text-red-400/70">Sign out of your account</p>
            </div>
          </button>
        </GlassCard>

        {/* App Info */}
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-3 flex items-center justify-center">
              <Smartphone size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-white mb-1">College Events</h3>
            <p className="text-sm text-white/70 mb-2">Version 2.0.0</p>
            <p className="text-xs text-white/50 leading-relaxed">
              Discover amazing events happening around your campus with style ✨
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default Profile;