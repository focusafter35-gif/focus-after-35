import React, { useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';

const AdSenseHead = memo(() => {
  useEffect(() => {
    const pushAd = () => {
      try {
        if (window.adsbygoogle) {
          // Adsbygoogle initialization
        }
      } catch (e) {
        console.error('AdSense error:', e);
      }
    };
    
    // Defer execution to prioritize main thread rendering and LCP
    const timer = setTimeout(pushAd, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Helmet>
      <script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8938459943027377" 
        crossOrigin="anonymous"
      />
    </Helmet>
  );
});

AdSenseHead.displayName = 'AdSenseHead';

export default AdSenseHead;