// src/hooks/useFirebase.ts
import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import { MediaItem } from '../types';

export const useFirebase = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = async () => {
    if (!isOnline) return;

    setSyncStatus('syncing');
    try {
      await firebaseService.getMediaEvents();
      setSyncStatus('synced');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    }
  };

  return {
    isOnline,
    syncStatus,
    syncData,
    firebase: firebaseService
  };
};

// Hook for loading events with loading state
export const useEvents = (category: string = 'all') => {
  const [events, setEvents] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = category === 'all' 
        ? await firebaseService.getMediaEvents()
        : await firebaseService.getEventsByCategory(category);
      
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [category]);

  return { events, loading, error, refetch: loadEvents };
};
