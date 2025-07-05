import { lazy, Suspense, ComponentType } from 'react';
import { motion } from 'framer-motion';

// Loading component
const PageLoader = () => (
  <motion.div
    className="h-screen flex items-center justify-center bg-surface-primary"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-center">
      <motion.div
        className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
      <p className="text-body text-secondary">Loading...</p>
    </div>
  </motion.div>
);

// Wrapper for lazy components
export const withSuspense = <T extends ComponentType<any>>(
  Component: T,
  fallback = <PageLoader />
) => {
  return (props: any) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazy load heavy components
export const LazyVideoPromotion = lazy(() => 
  import('../components/features/VideoPromotion').then(module => ({ 
    default: module.VideoPromotion 
  }))
);

export const LazyFeedbackWidget = lazy(() => 
  import('../components/feedback/FeedbackWidget').then(module => ({ 
    default: module.FeedbackWidget 
  }))
);

export const LazyPDFViewer = lazy(() => 
  import('../components/ui/PDFStackView').then(module => ({ 
    default: module.PDFStackView 
  }))
);

// Lazy load pages for code splitting
export const LazyHome = lazy(() => import('../pages/Home'));
export const LazyCategories = lazy(() => import('../pages/Categories'));
export const LazyPremiumAddPage = lazy(() => import('../pages/PremiumAddPage'));
export const LazySaved = lazy(() => import('../pages/Saved'));
export const LazyProfile = lazy(() => import('../pages/Profile'));
