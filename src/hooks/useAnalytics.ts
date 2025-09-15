import { useCallback } from 'react';

type AnalyticsEvent = 
  | 'page_view'
  | 'animal_liked'
  | 'animal_passed'
  | 'match_created'
  | 'profile_viewed'
  | 'message_sent'
  | 'filter_applied'
  | 'auth_signup'
  | 'auth_signin';

interface AnalyticsProperties {
  [key: string]: string | number | boolean;
}

export const useAnalytics = () => {
  const track = useCallback((event: AnalyticsEvent, properties?: AnalyticsProperties) => {
    // In production, this would integrate with analytics services like:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - PostHog
    
    const analyticsData = {
      event,
      properties: {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...properties,
      },
    };

    // For development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', analyticsData);
    }

    // In production, send to analytics service
    // Example: gtag('event', event, properties);
    // Example: mixpanel.track(event, properties);
    
    try {
      // Store in localStorage for demo purposes
      const storedEvents = JSON.parse(localStorage.getItem('petmatch_analytics') || '[]');
      storedEvents.push(analyticsData);
      
      // Keep only last 100 events
      if (storedEvents.length > 100) {
        storedEvents.splice(0, storedEvents.length - 100);
      }
      
      localStorage.setItem('petmatch_analytics', JSON.stringify(storedEvents));
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  const page = useCallback((pageName: string, properties?: AnalyticsProperties) => {
    track('page_view', { page: pageName, ...properties });
  }, [track]);

  const identify = useCallback((userId: string, properties?: AnalyticsProperties) => {
    // In production, identify the user
    if (process.env.NODE_ENV === 'development') {
      console.log('👤 User Identified:', userId, properties);
    }
    
    // Example: gtag('config', 'GA_MEASUREMENT_ID', { user_id: userId });
    // Example: mixpanel.identify(userId);
  }, []);

  return { track, page, identify };
};
