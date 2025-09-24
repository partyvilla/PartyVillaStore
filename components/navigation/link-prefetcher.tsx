"use client";

import { useEffect } from 'react';
import { getCategories } from '@/lib/database/services/supabase-categories';

// This component will prefetch important pages to make navigation faster
export default function LinkPrefetcher() {
  useEffect(() => {
    // Function to prefetch important pages
    const prefetchImportantPages = async () => {
      // Get dynamic category URLs
      let categoryUrls: string[] = [];
      try {
        const categories = await getCategories();
        // Prefetch top 6 categories
        categoryUrls = categories.slice(0, 6).map(cat => `/category/${cat.slug}`);
      } catch (error) {
      }

      // URLs to prefetch
      const urlsToPrefetch = [
        '/',
        '/shop',
        ...categoryUrls, // Dynamic category URLs
      ];

      // Use requestIdleCallback for browser idle time
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          // Prefetch using link preload
          urlsToPrefetch.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
          });
        });
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(() => {
          urlsToPrefetch.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
          });
        }, 2000); // Wait 2 seconds after page load
      }
    };

    // Start prefetching after the page has loaded
    if (document.readyState === 'complete') {
      prefetchImportantPages();
    } else {
      window.addEventListener('load', prefetchImportantPages);
      return () => window.removeEventListener('load', prefetchImportantPages);
    }
  }, []);

  return null; // This component doesn't render anything
}
