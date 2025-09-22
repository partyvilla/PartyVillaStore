"use client";

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register service worker in production or if explicitly enabled
    if ('serviceWorker' in navigator && (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_SW === 'true')) {
      const registerSW = async () => {
        try {
          // Check if service worker file exists before registering
          const response = await fetch('/service-worker.js', { method: 'HEAD' });

          if (!response.ok) {
            return;
          }

          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          });


          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Optionally notify user about update
                }
              });
            }
          });

        } catch (error) { }
      };

      // Register on load
      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
      }
    }
  }, []);

  return null;
}
