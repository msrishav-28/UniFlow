// src/utils/hapticFeedback.ts
export const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  // Check if vibration API is available
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30]
    };
    
    navigator.vibrate(patterns[style]);
  }
  
  // For iOS devices using the Taptic Engine (if available)
  if ((window as any).webkit?.messageHandlers?.haptic) {
    const impactStyles = {
      light: 'light',
      medium: 'medium',
      heavy: 'heavy'
    };
    
    (window as any).webkit.messageHandlers.haptic.postMessage({
      type: 'impact',
      style: impactStyles[style]
    });
  }
};

// Specific haptic patterns for different actions
export const haptics = {
  tap: () => triggerHaptic('light'),
  success: () => triggerHaptic('medium'),
  error: () => navigator.vibrate?.([50, 100, 50]),
  warning: () => triggerHaptic('heavy'),
  notification: () => navigator.vibrate?.([100, 50, 100])
};