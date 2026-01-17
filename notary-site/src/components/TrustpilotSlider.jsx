'use client'

import { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Image from 'next/image';

const TrustpilotSlider = () => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  // Avis Trustpilot réels depuis https://fr.trustpilot.com/review/mynotary.io?languages=all
  // Tous les 9 avis avec leurs timestamps réels
  const reviews = [
    {
      id: 1,
      rating: 5,
      textKey: 'trustpilot.reviews.review1',
      author: "Kyle Fournier",
      country: "FR",
      verified: true,
      timeAgo: "1 day ago",
      timeAgoKey: 'trustpilot.timeAgo.1day'
    },
    {
      id: 2,
      rating: 5,
      textKey: 'trustpilot.reviews.review2',
      author: "Julia Booker",
      country: "US",
      verified: true,
      timeAgo: "3 days ago",
      timeAgoKey: 'trustpilot.timeAgo.3days'
    },
    {
      id: 3,
      rating: 5,
      textKey: 'trustpilot.reviews.review3',
      author: "Julie",
      country: "US",
      verified: true,
      timeAgo: "4 days ago",
      timeAgoKey: 'trustpilot.timeAgo.4days'
    },
    {
      id: 4,
      rating: 5,
      textKey: 'trustpilot.reviews.review4',
      author: "Robbo",
      country: "IT",
      verified: true,
      timeAgo: "5 days ago",
      timeAgoKey: 'trustpilot.timeAgo.5days'
    },
    {
      id: 5,
      rating: 5,
      textKey: 'trustpilot.reviews.review5',
      author: "Gabriele Angelotti",
      country: "DE",
      verified: true,
      timeAgo: "6 days ago",
      timeAgoKey: 'trustpilot.timeAgo.6days'
    },
    {
      id: 6,
      rating: 5,
      textKey: 'trustpilot.reviews.review6',
      author: "Helen White",
      country: "DE",
      verified: true,
      timeAgo: "7 days ago",
      timeAgoKey: 'trustpilot.timeAgo.7days'
    },
    {
      id: 7,
      rating: 5,
      textKey: 'trustpilot.reviews.review7',
      author: "Romano",
      country: "PT",
      verified: true,
      timeAgo: "9 days ago",
      timeAgoKey: 'trustpilot.timeAgo.9days'
    },
    {
      id: 8,
      rating: 5,
      textKey: 'trustpilot.reviews.review8',
      author: "Denis Dubrovin",
      country: "GB",
      verified: true,
      timeAgo: "9 days ago",
      timeAgoKey: 'trustpilot.timeAgo.9days'
    },
    {
      id: 9,
      rating: 5,
      textKey: 'trustpilot.reviews.review9',
      author: "Ulvi",
      country: "GB",
      verified: true,
      timeAgo: "8 days ago",
      timeAgoKey: 'trustpilot.timeAgo.8days'
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
    <section className="py-12 md:py-16 bg-white border-b border-gray-100">
      {/* Header avec logo Trustpilot - contenu centré avec max-width */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-[30px] mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-6">
          {/* Texte à gauche sur desktop */}
          <span className="text-sm md:text-base text-gray-600 font-medium">
            {t('trustpilot.rating')}
          </span>
          
          {/* Logo Trustpilot avec 5 étoiles à droite sur desktop */}
          <div className="relative w-48 h-10 md:w-64 md:h-12">
            <Image
              src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/da5d4b50-9730-4759-2fe2-e7a593be7600/public"
              alt="Trustpilot 5 stars"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Slider avec défilement infini - pleine largeur */}
      <div className="overflow-hidden relative w-full">
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
                <div className="bg-white rounded-lg p-6 h-full border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col">
                  {/* Stars et timestamp - alignés en haut */}
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    {/* 5 étoiles vertes */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-5 h-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {/* Timestamp */}
                    <span className="text-gray-400 text-xs">
                      {review.timeAgoKey ? t(review.timeAgoKey) : review.timeAgo}
                    </span>
                  </div>

                  {/* Review text - prend l'espace disponible */}
                  <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed flex-grow">
                    {t(review.textKey)}
                  </p>

                  {/* Author info - aligné en bas */}
                  <div className="mt-auto flex-shrink-0 pt-3 border-t border-gray-100">
                    <p className="text-gray-600 text-sm font-medium">{review.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
};

export default TrustpilotSlider;
