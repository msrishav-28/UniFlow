import React, { useState } from 'react';
import { User, Calendar, Heart, Upload, Settings, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import UploadModal from '../components/Upload/UploadModal';

const Profile: React.FC = () => {
  const { user, events } = useStore();
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const savedEventsCount = events.filter(event => event.isBookmarked).length;
  const userEventsCount = events.filter(event => 
    event.uploadedAt && Date.now() - event.uploadedAt < 86400000 * 7 // Events from last 7 days as user events
  ).length;

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? This will clear all your data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 px-4 pt-12 pb-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-white/80 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart size={20} className="text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{savedEventsCount}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Saved Events</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar size={20} className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userEventsCount}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Events Shared</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 space-y-4">
        {/* Upload Event */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-medium transition-colors flex items-center justify-center shadow-lg"
        >
          <Upload size={20} className="mr-3" />
          Upload New Event
        </button>

        {/* Menu Items */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <button className="w-full flex items-center px-4 py-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mr-3">
              <Settings size={18} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900 dark:text-white">Settings</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">App preferences</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <div className="w-10 h-10 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mr-3">
              <LogOut size={18} className="text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-red-600 dark:text-red-400">Logout</p>
              <p className="text-sm text-red-500/70 dark:text-red-400/70">Sign out of your account</p>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">College Events</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Version 1.0.0</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Discover amazing events happening around your campus
            </p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </div>
  );
};

export default Profile;