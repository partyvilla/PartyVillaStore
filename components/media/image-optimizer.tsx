"use client";

import { useEffect } from 'react';

// This component performs image prefetching for critical images without modifying the DOM
export default function ImageOptimizer() {
  useEffect(() => {
    // Only run in the browser
    if (typeof window === 'undefined') return;

    // Critical images to prefetch
    const criticalImages = [
      '/party-villa banner.webp',
      '/birthday-essentials.png',
      '/party-decorations.png',
      '/festive-celebration-with-balloons-and-confetti.png',
      '/special-occasions-party-decor.png',
      '/pastel-balloons-pack.png',
      '/balloons-assortment.png',
    ];

    // Use requestIdleCallback to prefetch images during browser idle time
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        prefetchImages(criticalImages);
      });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => {
        prefetchImages(criticalImages);
      }, 1000);
    }
  }, []);

  // Function to prefetch images
  const prefetchImages = (imagePaths: string[]) => {
    imagePaths.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = path;
      document.head.appendChild(link);
    });
  };

  return null; // This component doesn't render anything
}
