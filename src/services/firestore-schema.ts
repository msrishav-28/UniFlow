// src/services/firestore-schema.ts

// Type definitions for our Firestore collections
export interface AnalyticsEvent {
  eventName: string;
    eventCategory: string;
      properties: Record<string, any>;
        userId: string;
          sessionId: string;
            timestamp: Date;
              deviceInfo: DeviceInfo;
              }

              export interface FeedbackReport {
                id?: string;
                  type: 'bug' | 'feedback' | 'feature_request';
                    title: string;
                      description: string;
                        screenshotUrl?: string;
                          userId: string;
                            status: 'open' | 'in_progress' | 'resolved';
                              priority: 'low' | 'medium' | 'high' | 'critical';
                                createdAt: Date;
                                  resolvedAt?: Date;
                                    metadata: {
                                        url: string;
                                            userAgent: string;
                                                viewport: string;
                                                    theme: string;
                                                      };
                                                      }

                                                      export interface MediaEvent {
                                                        id: string;
                                                          type: 'image' | 'video' | 'pdf';
                                                            mediaUrl: string;
                                                              eventTitle: string;
                                                                description?: string;
                                                                  category: string;
                                                                    eventDate: Date;
                                                                      uploadedBy: string;
                                                                        uploadedAt: Date;
                                                                          viewCount: number;
                                                                            bookmarkCount: number;
                                                                              thumbnailUrl?: string;
                                                                                pageCount?: number; // for PDFs
                                                                                  promotionalVideoUrl?: string;
                                                                                  }

                                                                                  export interface UserSession {
                                                                                    sessionId: string;
                                                                                      userId: string;
                                                                                        startTime: Date;
                                                                                          endTime?: Date;
                                                                                            pageViews: number;
                                                                                              events: string[];
                                                                                                deviceInfo: DeviceInfo;
                                                                                                }

                                                                                                export interface DeviceInfo {
                                                                                                  platform: string;
                                                                                                    userAgent: string;
                                                                                                      language: string;
                                                                                                        screenResolution: string;
                                                                                                          viewport: string;
                                                                                                            deviceType: 'mobile' | 'desktop';
                                                                                                              online: boolean;
                                                                                                              }

                                                                                                              // Collection names as constants
                                                                                                              export const COLLECTIONS = {
                                                                                                                ANALYTICS: 'analytics_events',
                                                                                                                  FEEDBACK: 'feedback_reports',
                                                                                                                    EVENTS: 'media_events',
                                                                                                                      SESSIONS: 'user_sessions',
                                                                                                                        PAGE_VIEWS: 'page_views',
                                                                                                                          FEATURE_USAGE: 'feature_usage'
                                                                                                                          } as const;