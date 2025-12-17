import { useEffect } from 'react';

const ANIMATED_SELECTOR =
  '.scroll-fade-in, .scroll-slide-up, .scroll-slide-left, .scroll-slide-right';

const revealImmediately = (elements) => {
  elements.forEach((element) => {
    element.classList.add('is-visible');
    element.dataset.scrollObserved = 'true';
  });
};

export const useScrollAnimation = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const getAnimatedElements = () =>
      document.querySelectorAll(ANIMATED_SELECTOR);

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      revealImmediately(getAnimatedElements());
      return undefined;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observedElements = new Set();
    if (!observedElements || typeof observedElements.add !== 'function') {
      console.error('Failed to initialize observedElements Set');
      return undefined;
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const { target } = entry;
          if (target && target.classList) {
            target.classList.add('is-visible');
          }
          if (observedElements && typeof observedElements.add === 'function') {
            observedElements.add(target);
          }
          intersectionObserver.unobserve(target);
        }
      });
    }, observerOptions);

    const observeAnimatedElements = () => {
      const observe = () => {
        getAnimatedElements().forEach((element) => {
          if (!element.dataset.scrollObserved) {
            element.dataset.scrollObserved = 'true';
            intersectionObserver.observe(element);
          }
        });
      };

      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(observe);
      } else {
        observe();
      }
    };

    observeAnimatedElements();

    const mutationObserver = new MutationObserver(() => {
      observeAnimatedElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
      observedElements.forEach((element) => {
        delete element.dataset.scrollObserved;
      });
    };
  }, []);
};
