// src/services/analyticsService.ts
import { 
  collection, 
    addDoc, 
      serverTimestamp,
        query,
          where,
            getDocs,
              orderBy,
                limit,
                  Timestamp
                  } from 'firebase/firestore';
                  import { logEvent } from 'firebase/analytics';
                  import { db, analytics, getAnonymousUserId } from './firebase';
                  import { COLLECTIONS, AnalyticsEvent } from './firestore-schema';

                  class AnalyticsService {
                    private userId: string;
                      private sessionId: string;

                        constructor() {
                            this.userId = getAnonymousUserId();
                                this.sessionId = this.generateSessionId();
                                  }

                                    private generateSessionId(): string {
                                        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                                          }

                                            // Track page views
                                              async trackPageView(pageName: string, properties?: Record<string, any>) {
                                                  try {
                                                        // Google Analytics
                                                              logEvent(analytics, 'page_view', {
                                                                      page_title: pageName,
                                                                              page_location: window.location.href,
                                                                                      ...properties
                                                                                            });

                                                                                                  // Firestore
                                                                                                        await addDoc(collection(db, COLLECTIONS.PAGE_VIEWS), {
                                                                                                                userId: this.userId,
                                                                                                                        sessionId: this.sessionId,
                                                                                                                                pageName,
                                                                                                                                        pageUrl: window.location.href,
                                                                                                                                                timestamp: serverTimestamp(),
                                                                                                                                                        ...properties
                                                                                                                                                              });
                                                                                                                                                                  } catch (error) {
                                                                                                                                                                        console.error('Error tracking page view:', error);
                                                                                                                                                                            }
                                                                                                                                                                              }

                                                                                                                                                                                // Track custom events
                                                                                                                                                                                  async trackEvent(
                                                                                                                                                                                      eventName: string,
                                                                                                                                                                                          properties?: Record<string, any>,
                                                                                                                                                                                              category: string = 'general'
                                                                                                                                                                                                ) {
                                                                                                                                                                                                    try {
                                                                                                                                                                                                          // Google Analytics
                                                                                                                                                                                                                logEvent(analytics, eventName, properties);

                                                                                                                                                                                                                      // Firestore
                                                                                                                                                                                                                            const eventData: Omit<AnalyticsEvent, 'timestamp'> & { timestamp: any } = {
                                                                                                                                                                                                                                    eventName,
                                                                                                                                                                                                                                            eventCategory: category,
                                                                                                                                                                                                                                                    properties: properties || {},
                                                                                                                                                                                                                                                            userId: this.userId,
                                                                                                                                                                                                                                                                    sessionId: this.sessionId,
                                                                                                                                                                                                                                                                            timestamp: serverTimestamp(),
                                                                                                                                                                                                                                                                                    deviceInfo: this.getDeviceInfo()
                                                                                                                                                                                                                                                                                          };

                                                                                                                                                                                                                                                                                                await addDoc(collection(db, COLLECTIONS.ANALYTICS), eventData);
                                                                                                                                                                                                                                                                                                    } catch (error) {
                                                                                                                                                                                                                                                                                                          console.error('Error tracking event:', error);
                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                  // Track feature usage
                                                                                                                                                                                                                                                                                                                    async trackFeatureUsage(featureName: string, duration?: number) {
                                                                                                                                                                                                                                                                                                                        try {
                                                                                                                                                                                                                                                                                                                              await addDoc(collection(db, COLLECTIONS.FEATURE_USAGE), {
                                                                                                                                                                                                                                                                                                                                      userId: this.userId,
                                                                                                                                                                                                                                                                                                                                              sessionId: this.sessionId,
                                                                                                                                                                                                                                                                                                                                                      featureName,
                                                                                                                                                                                                                                                                                                                                                              duration: duration || 0,
                                                                                                                                                                                                                                                                                                                                                                      timestamp: serverTimestamp()
                                                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                                                                } catch (error) {
                                                                                                                                                                                                                                                                                                                                                                                      console.error('Error tracking feature usage:', error);
                                                                                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                              private getDeviceInfo() {
                                                                                                                                                                                                                                                                                                                                                                                                  return {
                                                                                                                                                                                                                                                                                                                                                                                                        platform: navigator.platform,
                                                                                                                                                                                                                                                                                                                                                                                                              userAgent: navigator.userAgent,
                                                                                                                                                                                                                                                                                                                                                                                                                    language: navigator.language,
                                                                                                                                                                                                                                                                                                                                                                                                                          screenResolution: `${window.screen.width}x${window.screen.height}`,
                                                                                                                                                                                                                                                                                                                                                                                                                                viewport: `${window.innerWidth}x${window.innerHeight}`,
                                                                                                                                                                                                                                                                                                                                                                                                                                      deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                                                                                                                                                                                                                                                                                                                                                                                                                                            online: navigator.onLine
                                                                                                                                                                                                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                                                                                                                                                                                  export const analyticsService = new AnalyticsService();