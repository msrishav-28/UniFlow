import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { AppState, MediaItem, User } from '../types';
import toast from 'react-hot-toast';
import { handleFirebaseError } from '../services/firebase';

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
      mediaItems: [],
      user: initialUser,
      currentCategory: 'all',
      isLoading: false,
      lastRefresh: Date.now(),
      error: null,
      
      // Initialize Firebase data
      initializeFirebaseData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Set up real-time listener for events
          const eventsQuery = query(
            collection(db, 'events'),
            orderBy('uploadedAt', 'desc'),
            limit(50)
          );
          
          const unsubscribe = onSnapshot(eventsQuery, 
            (snapshot) => {
              const events: MediaItem[] = [];
              snapshot.forEach((doc) => {
                const data = doc.data();
                events.push({
                  id: doc.id,
                  type: data.type || 'image',
                  mediaUrl: data.mediaUrl,
                  thumbnailUrl: data.thumbnailUrl,
                  category: data.category,
                  eventDate: data.eventDate,
                  eventTitle: data.eventTitle,
                  description: data.description,
                  duration: data.duration,
                  pageCount: data.pageCount,
                  coverImage: data.coverImage,
                  aspectRatio: data.aspectRatio || '9:16',
                  isBookmarked: get().user.bookmarkedEvents.includes(doc.id),
                  viewCount: data.viewCount || 0,
                  engagementTime: data.engagementTime || 0,
                  uploadedAt: data.uploadedAt?.toMillis() || Date.now(),
                  tags: data.tags || [],
                  location: data.location,
                  organizer: data.organizer
                });
              });
              
              set({ 
                mediaItems: events, 
                isLoading: false,
                lastRefresh: Date.now() 
              });
            },
            (error) => {
              console.error('Firebase listener error:', error);
              set({ 
                error: 'Failed to load events. Please try again.',
                isLoading: false 
              });
              toast.error('Failed to load events');
            }
          );
          
          // Store unsubscribe function for cleanup
          (window as any).__firestoreUnsubscribe = unsubscribe;
          
        } catch (error) {
          console.error('Failed to initialize Firebase:', error);
          const errorMessage = handleFirebaseError(error);
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          toast.error(errorMessage);
        }
      },
      
      // Add new media item to Firebase
      addMediaItem: async (itemData) => {
        try {
          const eventData = {
            ...itemData,
            uploadedAt: serverTimestamp(),
            viewCount: 0,
            engagementTime: 0,
            userId: get().user.id
          };
          
          await addDoc(collection(db, 'events'), eventData);
          
          toast.success('Event created successfully!');
          
          // The real-time listener will automatically update the local state
          
        } catch (error) {
          console.error('Failed to add event:', error);
          const errorMessage = handleFirebaseError(error);
          toast.error(errorMessage);
        }
      },
      
      // Toggle bookmark with Firebase update
      toggleBookmark: async (itemId) => {
        const item = get().mediaItems.find(i => i.id === itemId);
        if (!item) return;
        
        const isBookmarked = !item.isBookmarked;
        
        // Optimistic update
        set((state) => {
          const updatedItems = state.mediaItems.map(item =>
            item.id === itemId
              ? { ...item, isBookmarked }
              : item
          );
          
          const updatedBookmarks = isBookmarked
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
        
        // Update Firebase (optional - depends on your backend structure)
        try {
          // You might want to update a user collection with bookmarks
          // await updateDoc(doc(db, 'users', get().user.id), {
          //   bookmarkedEvents: updatedBookmarks
          // });
        } catch (error) {
          console.error('Failed to update bookmark:', error);
          const errorMessage = handleFirebaseError(error);
          toast.error(errorMessage);
          // Revert on error
          set((state) => ({
            mediaItems: state.mediaItems.map(item =>
              item.id === itemId
                ? { ...item, isBookmarked: !isBookmarked }
                : item
            )
          }));
        }
      },
      
      setCategory: (category) => {
        set({ currentCategory: category });
      },
      
      // Update engagement with Firebase
      updateEngagement: async (itemId, timeSpent) => {
        const item = get().mediaItems.find(i => i.id === itemId);
        if (!item) return;
        
        // Local update
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
        
        // Firebase update (debounced in real app)
        try {
          await updateDoc(doc(db, 'events', itemId), {
            engagementTime: item.engagementTime + timeSpent,
            viewCount: item.viewCount + (timeSpent > 3 ? 1 : 0)
          });
        } catch (error) {
          console.error('Failed to update engagement:', error);
          const errorMessage = handleFirebaseError(error);
          console.error(errorMessage);
        }
      },
      
      refreshFeed: async () => {
        // Force refresh by re-initializing
        await get().initializeFirebaseData();
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
        user: state.user,
        lastRefresh: state.lastRefresh
      })
    }
  )
);

// Cleanup Firebase listener on app unmount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const unsubscribe = (window as any).__firestoreUnsubscribe;
    if (unsubscribe) {
      unsubscribe();
    }
  });
}
