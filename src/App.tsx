import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNavigation from './components/Layout/BottomNavigation';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import { useStore } from './store/useStore';

function App() {
  const { cleanupOldEvents } = useStore();

  useEffect(() => {
    // Clean up old events on app load
    cleanupOldEvents();

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

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateTheme);
    };
  }, [cleanupOldEvents]);

  return (
    <Router>
      <div className="bg-white dark:bg-slate-900 min-h-screen max-w-sm mx-auto relative overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;