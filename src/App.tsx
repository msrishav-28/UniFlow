import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingNavBar from './components/ui/FloatingNavBar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Add from './pages/Add';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import { useStore } from './store/useStore';

function App() {
  const { cleanupOldItems } = useStore();

  useEffect(() => {
    // Clean up old items on app load
    cleanupOldItems();

    // Set up dark mode based on system preference
    const updateTheme = () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

    // PWA install prompt
    let deferredPrompt: any;
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateTheme);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [cleanupOldItems]);

  return (
    <Router>
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen max-w-sm mx-auto relative overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/add" element={<Add />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
        <FloatingNavBar />
      </div>
    </Router>
  );
}

export default App;