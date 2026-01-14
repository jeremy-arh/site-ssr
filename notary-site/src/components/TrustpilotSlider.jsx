'use client'

import { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Image from 'next/image';

const TrustpilotSlider = () => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  // Avis Trustpilot réels depuis https://fr.trustpilot.com/review/mynotary.io
  // Les textes sont traduits via le système de traduction
  const reviews = [
    {
      id: 1,
      rating: 5,
      textKey: 'trustpilot.reviews.review1',
      author: "Julia Booker",
      country: "US",
      verified: true
    },
    {
      id: 2,
      rating: 5,
      textKey: 'trustpilot.reviews.review2',
      author: "Julie",
      country: "US",
      verified: true
    },
    {
      id: 3,
      rating: 5,
      textKey: 'trustpilot.reviews.review3',
      author: "Max",
      country: "IT",
      verified: true
    },
    {
      id: 4,
      rating: 5,
      textKey: 'trustpilot.reviews.review4',
      author: "Gabriele Angelotti",
      country: "DE",
      verified: true
    },
    {
      id: 5,
      rating: 5,
      textKey: 'trustpilot.reviews.review5',
      author: "Helen White",
      country: "DE",
      verified: true
    },
    {
      id: 6,
      rating: 5,
      textKey: 'trustpilot.reviews.review6',
      author: "Romano",
      country: "PT",
      verified: true
    },
    {
      id: 7,
      rating: 5,
      textKey: 'trustpilot.reviews.review7',
      author: "Denis Dubrovin",
      country: "GB",
      verified: true
    },
    {
      id: 8,
      rating: 5,
      textKey: 'trustpilot.reviews.review8',
      author: "Ulvi",
      country: "GB",
      verified: true
    },
  ];

  // Dupliquer les avis pour créer l'effet de défilement infini
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  // Animation de défilement automatique
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Vitesse du défilement (pixels par frame)
    let animationFrameId;
    let isPaused = false;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Largeur d'une carte + gap
        const cardWidth = scrollContainer.firstChild?.offsetWidth || 0;
        const gap = 24; // gap-6 = 24px
        const totalWidth = (cardWidth + gap) * reviews.length;

        // Réinitialiser la position quand on atteint la fin du premier set
        if (scrollPosition >= totalWidth) {
          scrollPosition = 0;
        }

        scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    // Pause au survol
    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [reviews.length]);

  return (
    <section className="py-12 md:py-16 px-4 sm:px-[30px] bg-white border-b border-gray-100">
      <div className="max-w-[1300px] mx-auto">
        {/* Header avec logo Trustpilot */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-8">
          {/* Logo Trustpilot avec 5 étoiles */}
          <div className="relative w-48 h-10 md:w-64 md:h-12">
            <Image
              src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/da5d4b50-9730-4759-2fe2-e7a593be7600/public"
              alt="Trustpilot 5 stars"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          
          <span className="text-sm md:text-base text-gray-600 font-medium">
            {t('trustpilot.rating')}
          </span>
        </div>

        {/* Slider avec défilement infini */}
        <div className="overflow-hidden relative">
          {/* Ombre gauche */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          
          {/* Ombre droite */}
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
          
          <div
            ref={scrollRef}
            className="flex gap-6 will-change-transform items-stretch"
            style={{ width: 'fit-content' }}
          >
            {duplicatedReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="w-[300px] md:w-[350px] flex-shrink-0 flex"
              >
                <div className="bg-gray-50 rounded-xl p-6 h-full border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  {/* Stars - aligné en haut */}
                  <div className="flex items-center mb-3 flex-shrink-0">
                    <div className="relative w-24 h-5 md:w-28 md:h-6">
                      <Image
                        src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/ec7e0448-41ea-4fef-ee59-b617ab362f00/public"
                        alt="5 stars"
                        fill
                        className="object-contain object-left"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Review text - prend l'espace disponible */}
                  <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed line-clamp-4 flex-grow">
                    &quot;{t(review.textKey)}&quot;
                  </p>

                  {/* Author info - aligné en bas */}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-auto flex-shrink-0">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
                      <p className="text-gray-500 text-xs">{review.country}</p>
                    </div>
                    {review.verified && (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden md:inline">{t('trustpilot.verified') || 'Vérifié'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustpilotSlider;
