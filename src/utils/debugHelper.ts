import { logger } from './logger';

interface DebugInfo {
  environment: string;
  logLevel: string;
  firebaseConfig: {
    projectId: string;
    authDomain: string;
    hasApiKey: boolean;
    hasAppId: boolean;
  };
  browser: string;
  userAgent: string;
}

class DebugHelper {
  getDebugInfo(): DebugInfo {
    return {
      environment: import.meta.env.DEV ? 'development' : 'production',
      logLevel: logger.getLogLevel(),
      firebaseConfig: {
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'NOT_SET',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'NOT_SET',
        hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
        hasAppId: !!import.meta.env.VITE_FIREBASE_APP_ID
      },
      browser: navigator.userAgent.split(' ').slice(-2).join(' '),
      userAgent: navigator.userAgent
    };
  }

  printDebugInfo(): void {
    const info = this.getDebugInfo();

    console.group('%c🐛 Backs Note - Debug Info', 'color: #6366f1; font-size: 16px; font-weight: bold');
    console.log('%cEnvironment:', 'font-weight: bold', info.environment);
    console.log('%cLog Level:', 'font-weight: bold', info.logLevel);
    console.group('%cFirebase Config:', 'font-weight: bold');
    console.log('Project ID:', info.firebaseConfig.projectId);
    console.log('Auth Domain:', info.firebaseConfig.authDomain);
    console.log('Has API Key:', info.firebaseConfig.hasApiKey ? '✅' : '❌');
    console.log('Has App ID:', info.firebaseConfig.hasAppId ? '✅' : '❌');
    console.groupEnd();
    console.log('%cBrowser:', 'font-weight: bold', info.browser);
    console.groupEnd();

    console.group('%c💡 Available Debug Commands', 'color: #10b981; font-size: 14px; font-weight: bold');
    console.log('%cwindow.backsNote.setLogLevel(level)', 'font-family: monospace', '- Change log level (debug|info|warn|error|none)');
    console.log('%cwindow.backsNote.getLogLevel()', 'font-family: monospace', '- Get current log level');
    console.log('%cwindow.backsNote.clearCache()', 'font-family: monospace', '- Clear localStorage cache');
    console.log('%cwindow.backsNote.debug()', 'font-family: monospace', '- Show this debug info');
    console.groupEnd();
  }

  clearCache(): void {
    const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('backs-note-cache-'));
    cacheKeys.forEach(key => localStorage.removeItem(key));
    logger.info('Cache cleared', { clearedKeys: cacheKeys.length });
    console.log(`✅ Cleared ${cacheKeys.length} cache entries`);
  }
}

export const debugHelper = new DebugHelper();

// Expose debug utilities globally
if (typeof window !== 'undefined') {
  (window as typeof window & { backsNote?: {
    setLogLevel: (level: 'debug' | 'info' | 'warn' | 'error' | 'none') => void;
    getLogLevel: () => string;
    clearCache: () => void;
    debug: () => void;
  } }).backsNote = {
    setLogLevel: (level) => {
      logger.setLogLevel(level);
    },
    getLogLevel: () => logger.getLogLevel(),
    clearCache: () => debugHelper.clearCache(),
    debug: () => debugHelper.printDebugInfo()
  };
}
