import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Calendar, MapPin, Users, Tag, 
  Image as ImageIcon, Video, Sparkles, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { VideoPromotion } from '../components/features/VideoPromotion';

interface PremiumAddPageProps {
  onClose: () => void;
}

interface FormData {
  eventTitle: string;
  description: string;
  category: string;
  eventDate: string;
  location: string;
  organizer: string;
  tags: string;
  mediaUrl: string;
  type: 'image' | 'video' | 'pdf';
  pageCount?: number;
}

const PremiumAddPage = ({ onClose }: PremiumAddPageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
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
  
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [promotionalVideo, setPromotionalVideo] = useState<string | null>(null);

  console.log('Promotional video:', promotionalVideo); // Log for debugging

  const categories = [
    { value: 'technical', label: 'Technical', emoji: '🚀', color: 'from-blue-500 to-blue-600' },
    { value: 'cultural', label: 'Cultural', emoji: '🎭', color: 'from-purple-500 to-pink-500' },
    { value: 'guest-talks', label: 'Guest Talks', emoji: '🎤', color: 'from-emerald-500 to-teal-500' },
    { value: 'inter-college', label: 'Inter College', emoji: '🏆', color: 'from-orange-500 to-red-500' },
    { value: 'inter-department', label: 'Inter Dept', emoji: '⚔️', color: 'from-rose-500 to-pink-500' },
    { value: 'sports', label: 'Sports', emoji: '💪', color: 'from-yellow-500 to-orange-500' }
  ];

  const handleMediaUpload = (file: File) => {
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isPDF = file.type === 'application/pdf';

    if (!isImage && !isVideo && !isPDF) {
      alert('Please select an image, video, or PDF file');
      return;
    }

    const maxSize = isVideo ? 50 * 1024 * 1024 : isPDF ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size should be less than ${isVideo ? '50MB' : isPDF ? '20MB' : '10MB'}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result && typeof result === 'string') {
        setPreviewMedia(result);

        if (isPDF) {
          setFormData(prev => ({
            ...prev,
            mediaUrl: result,
            type: 'pdf' as const,
            pageCount: 1 // TODO: Replace with actual page count using PDF.js
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            mediaUrl: result,
            type: isImage ? 'image' as const : 'video' as const
          }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mediaUrl || !formData.eventTitle || !formData.eventDate) {
      return;
    }

    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowSuccess(true);
    setTimeout(() => {
      onClose?.();
    }, 1500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-surface-primary overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div
        className="glass-surface-elevated sticky top-0 z-10 px-5 py-4 flex items-center justify-between"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <h1 className="text-heading-2 text-primary">Create Event</h1>
        </div>
        
        <motion.button
          onClick={onClose}
          className="glass-button p-2 rounded-xl"
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} className="text-primary" />
        </motion.button>
      </motion.div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="px-5 pb-32 overflow-y-auto">
        {/* Media Upload Section */}
        <motion.div
          className="my-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="text-body font-semibold text-primary mb-3 block">
            Event Media
          </label>
          
          {previewMedia ? (
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {formData.type === 'video' ? (
                <video
                  src={previewMedia}
                  className="w-full h-64 object-cover"
                  controls
                />
              ) : formData.type === 'pdf' ? (
                <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                  <p className="text-body text-center text-secondary">
                    PDF Preview is not available. File uploaded: {formData.mediaUrl.split('/').pop()}
                  </p>
                </div>
              ) : (
                <img
                  src={previewMedia}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              )}
              
              {/* Remove Button */}
              <motion.button
                type="button"
                onClick={() => {
                  setPreviewMedia(null);
                  setFormData(prev => ({ ...prev, mediaUrl: '', type: 'image' }));
                }}
                className="absolute top-4 right-4 glass-surface-elevated p-2 rounded-xl"
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} className="text-white" />
              </motion.button>
              
              {/* Media Type Badge */}
              <div className="absolute bottom-4 left-4 glass-surface px-3 py-1 rounded-full">
                <span className="text-caption text-white font-medium flex items-center">
                  {formData.type === 'video' ? (
                    <>
                      <Video size={14} className="mr-1" />
                      Video
                    </>
                  ) : formData.type === 'pdf' ? (
                    <>
                      <FileText size={14} className="mr-1" />
                      PDF
                    </>
                  ) : (
                    <>
                      <ImageIcon size={14} className="mr-1" />
                      Image
                    </>
                  )}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className={`glass-surface border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
                dragActive 
                  ? 'border-primary-500 bg-primary-500/10' 
                  : 'border-border-primary hover:border-primary-500/50'
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleMediaUpload(file);
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ImageIcon size={32} className="text-primary/60" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                  >
                    <Video size={32} className="text-primary/60" />
                  </motion.div>
                </div>
                
                <div>
                  <p className="text-body font-medium text-primary mb-1">
                    Drop your media here
                  </p>
                  <p className="text-body-sm text-secondary">
                    or click to browse • Max 50MB
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-premium"
                >
                  <Upload size={18} className="mr-2" />
                  Choose File
                </button>
              </div>
            </motion.div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleMediaUpload(file);
            }}
            className="hidden"
          />
        </motion.div>

        {/* Event Details */}
        <motion.div
          className="space-y-5"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Title Input */}
          <div>
            <label className="text-body font-semibold text-primary mb-2 block">
              Event Title
            </label>
            <input
              type="text"
              value={formData.eventTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, eventTitle: e.target.value }))}
              className="w-full p-4 glass-surface rounded-2xl text-primary placeholder-tertiary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Give it a catchy name..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-body font-semibold text-primary mb-2 block">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full p-4 glass-surface rounded-2xl text-primary placeholder-tertiary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              placeholder="What makes this event special?"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="text-body font-semibold text-primary mb-3 block">
              Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                  className={`relative p-4 rounded-2xl transition-all ${
                    formData.category === category.value
                      ? 'shadow-lg'
                      : 'glass-surface hover:scale-105'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {formData.category === category.value && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} rounded-2xl opacity-10`} />
                  )}
                  
                  <div className="relative flex items-center space-x-3">
                    <span className="text-2xl">{category.emoji}</span>
                    <span className={`text-body-sm font-medium ${
                      formData.category === category.value ? 'text-primary' : 'text-secondary'
                    }`}>
                      {category.label}
                    </span>
                  </div>
                  
                  {formData.category === category.value && (
                    <motion.div
                      className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full"
                      layoutId="categoryIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <label className="text-body font-semibold text-primary mb-2 block">
              Event Date
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary" />
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                className="w-full pl-12 pr-4 py-4 glass-surface rounded-2xl text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-body font-semibold text-primary mb-2 block">
              Location
            </label>
            <div className="relative">
              <MapPin size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full pl-12 pr-4 py-4 glass-surface rounded-2xl text-primary placeholder-tertiary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Where's it happening?"
              />
            </div>
          </div>

          {/* Organizer */}
          <div>
            <label className="text-body font-semibold text-primary mb-2 block">
              Organizer
            </label>
            <div className="relative">
              <Users size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary" />
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                className="w-full pl-12 pr-4 py-4 glass-surface rounded-2xl text-primary placeholder-tertiary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Who's organizing?"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-body font-semibold text-primary mb-2 block">
              Tags
            </label>
            <div className="relative">
              <Tag size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary" />
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full pl-12 pr-4 py-4 glass-surface rounded-2xl text-primary placeholder-tertiary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="tech, innovation, fun"
              />
            </div>
          </div>

          {/* Promotional Video */}
          <motion.div
            className="my-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-body font-semibold text-primary mb-3 block">
              Promotional Video (Optional)
            </label>
            <p className="text-body-sm text-secondary mb-4">
              Add a short video to promote your event
            </p>
            
            <VideoPromotion
              eventId={formData.eventTitle}
              onUploadComplete={(videoUrl) => {
                setPromotionalVideo(videoUrl);
                toast.success('Promotional video uploaded!');
              }}
            />
          </motion.div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          className="mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="submit"
            disabled={isUploading || !formData.mediaUrl || !formData.eventTitle || !formData.eventDate}
            className={`w-full p-5 rounded-2xl font-semibold text-white transition-all flex items-center justify-center space-x-3 ${
              isUploading || !formData.mediaUrl || !formData.eventTitle || !formData.eventDate
                ? 'bg-neutral-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-primary-700 hover:shadow-xl active:scale-98'
            }`}
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
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  />
                  <span className="ml-3">Creating Event...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Sparkles size={20} />
                  <span className="ml-2">Create Event</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </form>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-surface-elevated p-8 rounded-3xl text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Sparkles size={32} className="text-white" />
                </motion.div>
              </motion.div>
              
              <h2 className="text-heading-2 text-primary mb-2">Event Created!</h2>
              <p className="text-body text-secondary">Your event is now live</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PremiumAddPage;