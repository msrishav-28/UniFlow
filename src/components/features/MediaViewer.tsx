import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { MediaItem } from '../../types';

interface MediaViewerProps {
  item: MediaItem;
  isActive: boolean;
  onEngagement: (timeSpent: number) => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ 
  item, 
  isActive, 
  onEngagement 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const startTimeRef = useRef<number>(Date.now());
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isActive && item.type === 'video') {
      setIsPlaying(true);
      startTimeRef.current = Date.now();
    } else {
      setIsPlaying(false);
      if (startTimeRef.current) {
        const timeSpent = (Date.now() - startTimeRef.current) / 1000;
        onEngagement(timeSpent);
      }
    }
  }, [isActive, item.type, onEngagement]);

  useEffect(() => {
    if (showControls) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(controlsTimeoutRef.current);
  }, [showControls]);

  const handleClick = () => {
    setShowControls(true);
    if (item.type === 'video') {
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played * 100);
  };

  if (item.type === 'video') {
    return (
      <div 
        className="relative w-full h-full bg-black cursor-pointer"
        onClick={handleClick}
      >
        <ReactPlayer
          url={item.mediaUrl}
          playing={isPlaying && isActive}
          muted={isMuted}
          loop
          width="100%"
          height="100%"
          onProgress={handleProgress}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />

        {/* Video Controls Overlay */}
        <motion.div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
        >
          <motion.button
            className="glass-card p-4 rounded-full"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? (
              <Pause size={32} className="text-white" />
            ) : (
              <Play size={32} className="text-white ml-1" />
            )}
          </motion.button>
        </motion.div>

        {/* Volume Control */}
        <motion.button
          className="absolute top-4 right-4 glass-card p-2 rounded-full"
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          animate={{ opacity: showControls ? 1 : 0 }}
        >
          {isMuted ? (
            <VolumeX size={20} className="text-white" />
          ) : (
            <Volume2 size={20} className="text-white" />
          )}
        </motion.button>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"
          animate={{ opacity: showControls ? 1 : 0 }}
        >
          <motion.div
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 bg-white/20 rounded-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      )}
      
      {imageError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center text-white/70">
            <div className="w-16 h-16 bg-white/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Play size={24} />
            </div>
            <p className="text-lg font-medium mb-2">{item.eventTitle || 'Event Media'}</p>
            <p className="text-sm opacity-75">Media unavailable</p>
          </div>
        </div>
      ) : (
        <motion.img
          src={item.mediaUrl}
          alt={item.eventTitle || 'Event media'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
          loading={isActive ? 'eager' : 'lazy'}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
};

export default MediaViewer;