import { logEvent } from 'firebase/analytics';
import { getAnalyticsInstance } from './firebase';
import { logger } from '../utils/logger';

export const trackEvent = (eventName: string, params?: Record<string, unknown>): void => {
  const analytics = getAnalyticsInstance();

  if (!analytics) {
    logger.debug('Analytics not initialized, skipping event', { eventName, params });
    return;
  }

  try {
    logEvent(analytics, eventName, params);
    logger.debug('Analytics event tracked', { eventName, params });
  } catch (error) {
    logger.error('Failed to track analytics event', { eventName, error });
  }
};

export const trackNoteCreated = (noteId: string): void => {
  trackEvent('note_created', { note_id: noteId });
};

export const trackNoteAccessed = (noteId: string): void => {
  trackEvent('note_accessed', { note_id: noteId });
};

export const trackNoteUpdated = (noteId: string, contentLength: number): void => {
  trackEvent('note_updated', {
    note_id: noteId,
    content_length: contentLength
  });
};

export const trackPageView = (pageName: string): void => {
  trackEvent('page_view', { page_name: pageName });
};
