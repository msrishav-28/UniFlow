// src/services/firebaseService.ts
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  where, 
  Timestamp,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { db, getAnonymousUserId, handleFirebaseError } from './firebase';
import { MediaItem, User } from '../types';
import { COLLECTIONS } from './firestore-schema';

// Convert Firestore timestamp to number for our MediaItem type
const convertFirestoreDoc = (doc: any): MediaItem => ({
  id: doc.id,
  type: doc.data().type,
  mediaUrl: doc.data().mediaUrl,
  thumbnailUrl: doc.data().thumbnailUrl,
  category: doc.data().category,
  eventDate: doc.data().eventDate instanceof Timestamp 
    ? doc.data().eventDate.toDate().toISOString() 
    : doc.data().eventDate,
  eventTitle: doc.data().eventTitle,
  description: doc.data().description,
  duration: doc.data().duration,
  pageCount: doc.data().pageCount,
  coverImage: doc.data().coverImage,
  aspectRatio: doc.data().aspectRatio || '16:9',
  isBookmarked: false, // Will be set based on user preferences
  viewCount: doc.data().viewCount || 0,
  engagementTime: doc.data().engagementTime || 0,
  uploadedAt: doc.data().uploadedAt instanceof Timestamp 
    ? doc.data().uploadedAt.toMillis() 
    : doc.data().uploadedAt,
  tags: doc.data().tags || [],
  location: doc.data().location,
  organizer: doc.data().organizer
});

export const firebaseService = {
  // Fetch all media events
  async getMediaEvents(): Promise<MediaItem[]> {
    try {
      const eventsCollection = collection(db, COLLECTIONS.EVENTS);
      const q = query(
        eventsCollection, 
        orderBy('uploadedAt', 'desc'),
        limit(50) // Limit to 50 most recent events
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreDoc);
    } catch (error) {
      console.error('Error fetching media events:', handleFirebaseError(error));
      return [];
    }
  },

  // Fetch events by category
  async getEventsByCategory(category: string): Promise<MediaItem[]> {
    try {
      const eventsCollection = collection(db, COLLECTIONS.EVENTS);
      const q = query(
        eventsCollection,
        where('category', '==', category),
        orderBy('uploadedAt', 'desc'),
        limit(30)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreDoc);
    } catch (error) {
      console.error('Error fetching events by category:', handleFirebaseError(error));
      return [];
    }
  },

  // Add new media event
  async addMediaEvent(eventData: Omit<MediaItem, 'id' | 'uploadedAt' | 'isBookmarked' | 'viewCount' | 'engagementTime'>): Promise<string> {
    try {
      const eventsCollection = collection(db, COLLECTIONS.EVENTS);
      const docData = {
        ...eventData,
        uploadedBy: getAnonymousUserId(),
        uploadedAt: Timestamp.now(),
        viewCount: 0,
        bookmarkCount: 0,
        eventDate: new Date(eventData.eventDate)
      };
      
      const docRef = await addDoc(eventsCollection, docData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding media event:', handleFirebaseError(error));
      throw error;
    }
  },

  // Update engagement metrics
  async updateEngagement(eventId: string, timeSpent: number): Promise<void> {
    try {
      const eventDoc = doc(db, COLLECTIONS.EVENTS, eventId);
      await updateDoc(eventDoc, {
        viewCount: (await getDocs(query(collection(db, COLLECTIONS.EVENTS), where('__name__', '==', eventId)))).docs[0]?.data()?.viewCount + 1 || 1,
        engagementTime: (await getDocs(query(collection(db, COLLECTIONS.EVENTS), where('__name__', '==', eventId)))).docs[0]?.data()?.engagementTime + timeSpent || timeSpent
      });
    } catch (error) {
      console.error('Error updating engagement:', handleFirebaseError(error));
    }
  },

  // Clean up old events (older than 30 days)
  async cleanupOldEvents(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const eventsCollection = collection(db, COLLECTIONS.EVENTS);
      const q = query(
        eventsCollection,
        where('eventDate', '<', Timestamp.fromDate(thirtyDaysAgo))
      );
      
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      
      await Promise.all(deletePromises);
      console.log(`Cleaned up ${deletePromises.length} old events`);
    } catch (error) {
      console.error('Error cleaning up old events:', handleFirebaseError(error));
    }
  }
};

// User preferences service (stored locally for now, can be moved to Firebase later)
export const userService = {
  getUser(): User {
    const userId = getAnonymousUserId();
    const savedUser = localStorage.getItem(`user_${userId}`);
    
    if (savedUser) {
      return JSON.parse(savedUser);
    }

    // Create new anonymous user
    const newUser: User = {
      id: userId,
      email: 'anonymous@student.edu',
      name: 'Anonymous Student',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
      bookmarkedEvents: [],
      preferences: {
        categories: ['technical', 'cultural'],
        notifications: true,
        autoplay: true
      }
    };

    localStorage.setItem(`user_${userId}`, JSON.stringify(newUser));
    return newUser;
  },

  updateUser(userData: Partial<User>): void {
    const userId = getAnonymousUserId();
    const currentUser = this.getUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser));
  },

  toggleBookmark(eventId: string): boolean {
    const user = this.getUser();
    const isBookmarked = user.bookmarkedEvents.includes(eventId);
    
    if (isBookmarked) {
      user.bookmarkedEvents = user.bookmarkedEvents.filter(id => id !== eventId);
    } else {
      user.bookmarkedEvents.push(eventId);
    }
    
    this.updateUser(user);
    return !isBookmarked;
  },

  isBookmarked(eventId: string): boolean {
    const user = this.getUser();
    return user.bookmarkedEvents.includes(eventId);
  }
};
