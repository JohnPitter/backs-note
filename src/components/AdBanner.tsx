import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  format = 'auto',
  responsive = true,
}) => {
  const { t } = useTranslation();
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);

  const adClient = import.meta.env.VITE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    // Only load ads in production and if client ID is configured
    if (!adClient || import.meta.env.DEV) {
      return;
    }

    // Prevent double loading
    if (isAdLoaded.current) {
      return;
    }

    try {
      // Load the AdSense script if not already loaded
      if (!document.querySelector('script[src*="adsbygoogle"]')) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Push ad to adsbygoogle array
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isAdLoaded.current = true;
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adClient]);

  // Don't render in development or if no client ID
  if (!adClient) {
    if (import.meta.env.DEV) {
      return (
        <div className="ad-container ad-placeholder">
          <span className="ad-label">{t('ads.label')}</span>
          <div className="ad-placeholder-content">
            <p>Ad Placeholder (DEV MODE)</p>
            <small>Configure VITE_ADSENSE_CLIENT_ID to show real ads</small>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="ad-container">
      <span className="ad-label">{t('ads.label')}</span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
