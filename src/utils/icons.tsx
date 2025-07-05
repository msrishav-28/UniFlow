// src/utils/icons.tsx
import { 
  Rocket, Drama, Mic, Trophy, Swords, Dumbbell,
  Calendar, MapPin, Users, Tag, Heart, Share2,
  Grid3x3, Home, Plus, User, FileText, Video,
  Image, ChevronLeft, ChevronRight, X, Play,
  Pause, Volume2, VolumeX, Download, ZoomIn,
  ZoomOut, Maximize2, Grid, CheckCircle, Loader
} from 'lucide-react';

// Category Icons Map
export const categoryIcons = {
  technical: Rocket,
  cultural: Drama,
  'guest-talks': Mic,
  'inter-college': Trophy,
  'inter-department': Swords,
  sports: Dumbbell
} as const;

// Category Colors Map
export const categoryColors = {
  technical: 'from-blue-500 to-blue-600',
  cultural: 'from-purple-500 to-pink-500',
  'guest-talks': 'from-emerald-500 to-teal-500',
  'inter-college': 'from-orange-500 to-red-500',
  'inter-department': 'from-rose-500 to-pink-500',
  sports: 'from-yellow-500 to-orange-500'
} as const;

// Category Badge Colors
export const categoryBadgeColors = {
  technical: 'bg-blue-500',
  cultural: 'bg-purple-500',
  'guest-talks': 'bg-green-500',
  'inter-college': 'bg-orange-500',
  'inter-department': 'bg-red-500',
  sports: 'bg-yellow-500'
} as const;

// Helper Functions
export const getCategoryIcon = (category: string) => {
  return categoryIcons[category as keyof typeof categoryIcons] || Tag;
};

export const getCategoryColor = (category: string) => {
  return categoryColors[category as keyof typeof categoryColors] || 'from-gray-500 to-gray-600';
};

export const getCategoryBadgeColor = (category: string) => {
  return categoryBadgeColors[category as keyof typeof categoryBadgeColors] || 'bg-gray-500';
};

// Export commonly used icons
export {
  // Navigation
  Home,
  Grid3x3,
  Plus,
  Heart,
  User,
  
  // Media
  FileText,
  Video,
  Image,
  Play,
  Pause,
  
  // Controls
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  
  // Info
  Calendar,
  MapPin,
  Users,
  Tag,
  Share2,
  
  // Status
  CheckCircle,
  Loader
};
