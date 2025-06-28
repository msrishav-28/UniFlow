export interface Event {
  id: string;
  posterUrl: string;
  category: 'technical' | 'cultural' | 'guest-talks' | 'inter-college' | 'inter-department' | 'sports';
  eventDate: string;
  uploadedAt: number;
  isBookmarked: boolean;
  title?: string;
  description?: string;
}

export interface User {
  email: string;
  name: string;
  bookmarkedEvents: string[];
}

export interface AppState {
  events: Event[];
  user: User;
  currentCategory: string;
  addEvent: (event: Omit<Event, 'id' | 'uploadedAt' | 'isBookmarked'>) => void;
  toggleBookmark: (eventId: string) => void;
  setCategory: (category: string) => void;
  cleanupOldEvents: () => void;
  refreshEvents: () => void;
}