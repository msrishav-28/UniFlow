import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumNavigation from './components/ui/PremiumNavigation';
import Home from './pages/Home';
import Categories from './pages/Categories';
import PremiumAddPage from './pages/PremiumAddPage';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import { useStore } from './store/useStore';

// Navigation wrapper component
function NavigationWrapper() {
  const navigate = useNavigate();
  return (
    <PremiumNavigation 
      currentPath={window.location.pathname}
      onNavigate={(path) => navigate(path)}
    />
  );
}

function App() {
  const { cleanupOldItems } = useStore();
  const [theme, setTheme] = useState('light');
  const [showAddPage, setShowAddPage] = useState(false);

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Clean up old items
    cleanupOldItems();

    // Remove old dark mode class
    document.documentElement.classList.remove('dark');
  }, [cleanupOldItems]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Router>
      <div className="bg-surface-primary min-h-screen max-w-[428px] mx-auto relative overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/add" element={
              <motion.div 
                className="h-screen flex items-center justify-center p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={() => setShowAddPage(true)}
                  className="btn-premium w-full max-w-xs"
                >
                  Create New Event
                </button>
              </motion.div>
            } />
            <Route path="/saved" element={<Saved />} />
            <Route path="/profile" element={
              <Profile onToggleTheme={toggleTheme} currentTheme={theme} />
            } />
          </Routes>
        </AnimatePresence>
        
        <NavigationWrapper />

        {/* Add Page Modal */}
        <AnimatePresence>
          {showAddPage && (
            <PremiumAddPage onClose={() => setShowAddPage(false)} />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;