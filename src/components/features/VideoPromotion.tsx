// src/components/features/VideoPromotion.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Upload, X, Play, Pause, CheckCircle } from 'lucide-react';
import { haptics } from '../../utils/hapticFeedback';

interface VideoPromotionProps {
  eventId: string;
  onUploadComplete?: (videoUrl: string) => void;
}

export const VideoPromotion: React.FC<VideoPromotionProps> = ({ 
  eventId, 
  onUploadComplete 
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate video
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    // Check size (max 100MB for promo videos)
    if (file.size > 100 * 1024 * 1024) {
      alert('Video size should be less than 100MB');
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    setIsUploading(true);
    haptics.tap();

    try {
      // Simulate upload with progress
      const uploadSimulation = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadSimulation);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // In real implementation, upload to Firebase Storage
      // const storageRef = ref(storage, `promotions/${eventId}/${Date.now()}.mp4`);
      // const uploadTask = uploadBytesResumable(storageRef, videoFile);
      // uploadTask.on('state_changed', (snapshot) => {
      //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //   setUploadProgress(progress);
      // });

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      haptics.success();
      onUploadComplete?.(videoPreview || '');
    } catch (error) {
      console.error('Upload failed:', error);
      haptics.error();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!videoPreview ? (
        <motion.div
          className="border-2 border-dashed border-border-primary rounded-2xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Video size={48} className="mx-auto mb-4 text-primary-500" />
          <h3 className="text-heading-3 text-primary mb-2">
            Upload Promotional Video
          </h3>
          <p className="text-body-sm text-secondary mb-4">
            30-60 seconds recommended • Max 100MB
          </p>
          <button className="btn-premium">
            <Upload size={20} className="mr-2" />
            Choose Video
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className="hidden"
          />
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Video Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={videoPreview}
              className="w-full aspect-video object-contain"
              controls
            />
            
            {!isUploading && (
              <motion.button
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl"
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setVideoPreview(null);
                  setVideoFile(null);
                  setUploadProgress(0);
                }}
              >
                <X size={20} />
              </motion.button>
            )}
          </div>

          {/* Video Info */}
          <div className="glass-surface p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body font-semibold text-primary">
                  {videoFile?.name}
                </p>
                <p className="text-caption text-secondary">
                  {(videoFile?.size || 0 / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              {uploadProgress === 100 ? (
                <CheckCircle size={24} className="text-green-500" />
              ) : (
                <div className="text-primary">
                  {uploadProgress > 0 && `${uploadProgress}%`}
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          {uploadProgress < 100 && (
            <motion.button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full btn-premium py-4"
              whileTap={{ scale: 0.98 }}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload size={20} className="mr-2" />
                  Upload Promotional Video
                </>
              )}
            </motion.button>
          )}
        </div>
      )}

      {/* Upload Progress */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};