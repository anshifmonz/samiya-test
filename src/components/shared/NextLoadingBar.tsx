'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface NextLoadingBarProps {
  color?: string;
  height?: number;
}

export default function NextLoadingBar({
  color = '#ef4444',
  height = 1,
}: NextLoadingBarProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      setProgress(0);

      const startProgress = () => {
        setProgress(prev => {
          if (prev >= 90) {
            return Math.min(prev + Math.random() * 2, 95);
          } else if (prev >= 70) {
            return prev + Math.random() * 5;
          } else {
            return prev + Math.random() * 10;
          }
        });
      };

      timer = setInterval(startProgress, 100);

      setTimeout(() => {
        completeLoading();
      }, 8000);
    }

    return () => clearInterval(timer);
  }, [isLoading]);

  const startLoading = () => {
    setIsLoading(true);
  };

  const completeLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 200);
  };

  // listen for navigation events
  useEffect(() => {
    const handleStart = () => startLoading();
    const handleComplete = () => completeLoading();

    // events for manual control
    window.addEventListener('routeChangeStart', handleStart);
    window.addEventListener('routeChangeComplete', handleComplete);
    window.addEventListener('routeChangeError', handleComplete);

    // listen for our custom events
    window.addEventListener('start-loading', handleStart);
    window.addEventListener('stop-loading', handleComplete);

    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link?.href && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:')) {
        try {
          const url = new URL(link.href);
          const isExternal = url.origin !== window.location.origin;

          if (!isExternal && url.pathname !== pathname) {
            startLoading();
          }
        } catch (e) {
          // Invalid URL, ignore
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('routeChangeStart', handleStart);
      window.removeEventListener('routeChangeComplete', handleComplete);
      window.removeEventListener('routeChangeError', handleComplete);
      window.removeEventListener('start-loading', handleStart);
      window.removeEventListener('stop-loading', handleComplete);
      document.removeEventListener('click', handleLinkClick);
    };
  }, [pathname]);

  useEffect(() => {
    completeLoading();
  }, [pathname]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted || (!isLoading && progress === 0)) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 75,
        left: 0,
        right: 0,
        height: height,
        background: `linear-gradient(to right, ${color}, ${color}E6, ${color}B3)`,
        boxShadow: `0 0 4px ${color}CC, 0 0 8px ${color}80, 0 0 16px ${color}40`,
        transform: `scaleX(${progress / 100}) scaleY(0.3)`,
        transformOrigin: 'left center',
        transition: 'transform 0.2s ease-out',
        zIndex: 9999,
        willChange: 'transform',
      }}
    />
  );
}

// for manual control
export const useNextLoadingBar = () => {
  const startLoading = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('start-loading'));
    }
  };

  const stopLoading = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stop-loading'));
    }
  };

  return { startLoading, stopLoading };
};
