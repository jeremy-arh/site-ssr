'use client'

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Get hash from window.location (Next.js doesn't provide it in usePathname)
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    
    // If there's a hash in the URL, scroll to that element
    if (hash) {
      // Scroll to top first
      window.scrollTo(0, 0);

      // Wait longer to ensure all components are mounted and rendered
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          console.warn(`Element with hash ${hash} not found`);
        }
      }, 500);
    } else {
      // Otherwise, scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
