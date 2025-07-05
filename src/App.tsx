import { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import PremiumNavigation from './components/ui/PremiumNavigation';
import { useStore } from './store/useStore';
import { analyticsService } from './services/analyticsService';
import { EdgeSwipeNavigation } from './components/GestureNavigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  LazyHome,
  LazyCategories,
  LazyPremiumAddPage,
  LazySaved,
  LazyProfile,
  LazyFeedbackWidget,
  withSuspense
} from './utils/lazyComponents';

// Wrap lazy components
const Home = withSuspense(LazyHome);
const Categories = withSuspense(LazyCategories);
const PremiumAddPage = withSuspense(LazyPremiumAddPage);
const Saved = withSuspense(LazySaved);
const Profile = withSuspense(LazyProfile);
const FeedbackWidget = withSuspense(LazyFeedbackWidget);

// Loading screen for initial app load
const AppLoader = () => (
  <div className="h-screen flex items-center justify-center bg-surface-primary">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <motion.div
        className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
      <h2 className="text-heading-2 text-primary">UniFlow</h2>
      <p className="text-body text-secondary mt-2">Events in Motion</p>
    </motion.div>
  </div>
);

// App content with routing
function AppContent() {
  const location = useLocation();
  const { cleanupOldItems, initializeFirebaseData, error } = useStore();
  const [theme, setTheme] = useState('light');
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Theme initialization
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Initialize Firebase data
        await initializeFirebaseData();

        // Clean up old items
        cleanupOldItems();

        // Track app launch
        analyticsService.trackEvent('app_launch', {
          version: '1.0.0',
          platform: 'pwa'
        });

        setAppReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setAppReady(true); // Still show app but with error state
      }
    };

    initApp();
  }, [cleanupOldItems, initializeFirebaseData]);

  // Track page views
  useEffect(() => {
    if (appReady) {
      analyticsService.trackPageView(location.pathname);
    }
  }, [location, appReady]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    analyticsService.trackEvent('theme_toggled', { theme: newTheme });
  };

  if (!appReady) {
    return <AppLoader />;
  }

  return (
    <div className="bg-surface-primary min-h-screen max-w-[428px] mx-auto relative overflow-hidden">
      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-50 bg-red-500 text-white p-3 text-center"
          >
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/add" element={<PremiumAddPage />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={
            <Profile onToggleTheme={toggleTheme} currentTheme={theme} />
          } />
        </Routes>
      </AnimatePresence>
      
      <PremiumNavigation />
      <EdgeSwipeNavigation />
      <Suspense fallback={null}>
        <FeedbackWidget />
      </Suspense>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
            color: theme === 'dark' ? '#fafafa' : '#171717',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;