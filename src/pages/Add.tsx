import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Calendar, Tag, Image as ImageIcon, Video, MapPin, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import GlassCard from '../components/ui/GlassCard';

const Add: React.FC = () => {
  const { addMediaItem } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    eventTitle: '',
    description: '',
    category: 'technical' as const,
    eventDate: '',
    location: '',
    organizer: '',
    tags: '',
    mediaUrl: '',
    type: 'image' as 'image' | 'video'
  });
  
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { value: 'technical', label: 'Technical', emoji: '🚀' },
    { value: 'cultural', label: 'Cultural', emoji: '🎭' },
    { value: 'guest-talks', label: 'Guest Talks', emoji: '🎤' },
    { value: 'inter-college', label: 'Inter College', emoji: '🏆' },
    { value: 'inter-department', label: 'Inter Department', emoji: '⚔️' },
    { value: 'sports', label: 'Sports', emoji: '💪' }
  ];

  const handleMediaUpload = (file: File) => {
    if (!file) return;

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    // Check file size (max 50MB for videos, 10MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size should be less than ${isVideo ? '50MB' : '10MB'}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewMedia(result);
      setFormData(prev => ({ 
        ...prev, 
        mediaUrl: result,
        type: isImage ? 'image' : 'video'
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleMediaUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) handleMediaUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mediaUrl || !formData.eventTitle || !formData.eventDate) {
      alert('Please fill all required fields');
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addMediaItem({
        type: formData.type,
        mediaUrl: formData.mediaUrl,
        category: formData.category,
        eventDate: formData.eventDate,
        eventTitle: formData.eventTitle,
        description: formData.description,
        aspectRatio: '9:16',
        location: formData.location || undefined,
        organizer: formData.organizer || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined
      });
      
      // Reset form
      setFormData({
        eventTitle: '',
        description: '',
        category: 'technical',
        eventDate: '',
        location: '',
        organizer: '',
        tags: '',
        mediaUrl: '',
        type: 'image'
      });
      setPreviewMedia(null);
      
      // Show success message or navigate
      alert('Event uploaded successfully! 🎉');
    } catch (error) {
      alert('Failed to upload event. Please try again.');
    } finally {
      setIsUploading(false);
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
      <div className="px-4">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Create Event ✨</h1>
          <p className="text-white/70">Share your amazing event with everyone!</p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Media Upload */}
          <GlassCard className="p-6">
            <label className="block text-white font-medium mb-3">
              Event Media * {formData.type === 'video' ? '🎥' : '📸'}
            </label>
            
            {previewMedia ? (
              <div className="relative rounded-2xl overflow-hidden">
                {formData.type === 'video' ? (
                  <video
                    src={previewMedia}
                    className="w-full h-64 object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={previewMedia}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPreviewMedia(null);
                    setFormData(prev => ({ ...prev, mediaUrl: '', type: 'image' }));
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-400/10' 
                    : 'border-white/30 hover:border-white/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <ImageIcon size={32} className="text-white/60" />
                    <Video size={32} className="text-white/60" />
                  </div>
                  <div>
                    <p className="text-white/80 font-medium mb-2">
                      Drop your media here or click to browse
                    </p>
                    <p className="text-white/60 text-sm">
                      Images up to 10MB, Videos up to 50MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="gradient-primary px-6 py-3 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Choose File
                  </button>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </GlassCard>

          {/* Event Details */}
          <GlassCard className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-white font-medium mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.eventTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, eventTitle: e.target.value }))}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Give your event a catchy title..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Tell everyone what makes this event special..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white font-medium mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.value as any }))}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      formData.category === category.value
                        ? 'gradient-primary text-white shadow-lg'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <span className="mr-2">{category.emoji}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-white font-medium mb-2">
                Event Date *
              </label>
              <div className="relative">
                <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </GlassCard>

          {/* Additional Details */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-white font-medium mb-3">Additional Details</h3>
            
            {/* Location */}
            <div>
              <label className="block text-white/80 font-medium mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Where is this happening?"
                />
              </div>
            </div>

            {/* Organizer */}
            <div>
              <label className="block text-white/80 font-medium mb-2">
                Organizer
              </label>
              <div className="relative">
                <Users size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Who's organizing this?"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white/80 font-medium mb-2">
                Tags
              </label>
              <div className="relative">
                <Tag size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="AI, Innovation, Fun (comma separated)"
                />
              </div>
            </div>
          </GlassCard>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isUploading}
            className="w-full gradient-primary p-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                  Uploading...
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Upload size={24} className="mr-3" />
                  Share Event 🚀
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default Add;