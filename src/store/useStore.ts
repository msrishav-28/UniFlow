import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, MediaItem, User } from '../types';
import { sampleMediaItems } from '../data/sampleData';

const initialUser: User = {
  id: '1',
  email: 'student@college.edu',
  name: 'Alex Chen',
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
  bookmarkedEvents: [],
  preferences: {
    categories: ['technical', 'cultural'],
    notifications: true,
    autoplay: true
  }
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      mediaItems: sampleMediaItems,
      user: initialUser,
      currentCategory: 'all',
      isLoading: false,
      lastRefresh: Date.now(),
      
      addMediaItem: (itemData) => {
        const newItem: MediaItem = {
          ...itemData,
          id: Date.now().toString(),
          uploadedAt: Date.now(),
          isBookmarked: false,
          viewCount: 0,
          engagementTime: 0
        };
        
        set((state) => ({
          mediaItems: [newItem, ...state.mediaItems]
        }));
      },
      
      toggleBookmark: (itemId) => {
        set((state) => {
          const updatedItems = state.mediaItems.map(item =>
            item.id === itemId
              ? { ...item, isBookmarked: !item.isBookmarked }
              : item
          );
          
          const item = updatedItems.find(i => i.id === itemId);
          const updatedBookmarks = item?.isBookmarked
            ? [...state.user.bookmarkedEvents, itemId]
            : state.user.bookmarkedEvents.filter(id => id !== itemId);
          
          return {
            mediaItems: updatedItems,
            user: {
              ...state.user,
              bookmarkedEvents: updatedBookmarks
            }
          };
        });
      },
      
      setCategory: (category) => {
        set({ currentCategory: category });
      },
      
      updateEngagement: (itemId, timeSpent) => {
        set((state) => ({
          mediaItems: state.mediaItems.map(item =>
            item.id === itemId
              ? { 
                  ...item, 
                  engagementTime: item.engagementTime + timeSpent,
                  viewCount: item.viewCount + (timeSpent > 3 ? 1 : 0)
                }
              : item
          )
        }));
      },
      
      refreshFeed: async () => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clean up old items and refresh
        get().cleanupOldItems();
        
        set({ 
          isLoading: false,
          lastRefresh: Date.now()
        });
      },
      
      cleanupOldItems: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        set((state) => ({
          mediaItems: state.mediaItems.filter(item => 
            new Date(item.eventDate) >= thirtyDaysAgo
          )
        }));
      }
    }),
    {
      name: 'college-events-storage',
      partialize: (state) => ({
        mediaItems: state.mediaItems,
        user: state.user,
        lastRefresh: state.lastRefresh
      })
    }
  )
);