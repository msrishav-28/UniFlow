// src/utils/imageOptimizer.ts
export const optimizeImageUrl = (url: string, width: number = 400) => {
  // If URL is a data URL (base64), return as is
  if (url.startsWith('data:')) {
    return url;
  }
  
  // If using Pexels (from your sample data)
  if (url.includes('pexels.com')) {
    // Pexels optimization parameters
    return url.replace(/\?.*$/, `?auto=compress&cs=tinysrgb&w=${width}&h=${Math.round(width * 1.78)}&dpr=2`);
  }
  
  // If using Cloudinary
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},h_${Math.round(width * 1.78)},c_fill,f_auto,q_auto/`);
  }
  
  // For other URLs, return as is
  return url;
};

// Helper to get optimized URL based on device
export const getOptimizedUrl = (url: string) => {
  const deviceWidth = window.innerWidth;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Calculate optimal width based on device
  const optimalWidth = Math.min(deviceWidth * pixelRatio, 1080);
  
  return optimizeImageUrl(url, optimalWidth);
};