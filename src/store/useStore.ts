import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Event, User } from '../types';
import { sampleEvents } from '../data/sampleEvents';

const initialUser: User = {
  email: 'student@college.edu',
  name: 'Alex Johnson',
  bookmarkedEvents: []
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      events: sampleEvents,
      user: initialUser,
      currentCategory: 'all',
      
      addEvent: (eventData) => {
        const newEvent: Event = {
          ...eventData,
          id: Date.now().toString(),
          uploadedAt: Date.now(),
          isBookmarked: false
        };
        
        set((state) => ({
          events: [newEvent, ...state.events]
        }));
      },
      
      toggleBookmark: (eventId) => {
        set((state) => {
          const updatedEvents = state.events.map(event =>
            event.id === eventId
              ? { ...event, isBookmarked: !event.isBookmarked }
              : event
          );
          
          const event = updatedEvents.find(e => e.id === eventId);
          const updatedBookmarks = event?.isBookmarked
            ? [...state.user.bookmarkedEvents, eventId]
            : state.user.bookmarkedEvents.filter(id => id !== eventId);
          
          return {
            events: updatedEvents,
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
      
      cleanupOldEvents: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        set((state) => ({
          events: state.events.filter(event => 
            new Date(event.eventDate) >= thirtyDaysAgo
          )
        }));
      },
      
      refreshEvents: () => {
        // Simulate refresh - in real app this would fetch from API
        get().cleanupOldEvents();
      }
    }),
    {
      name: 'college-events-storage',
      partialize: (state) => ({
        events: state.events,
        user: state.user
      })
    }
  )
);