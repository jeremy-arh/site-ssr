'use client'

import { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Image from 'next/image';

const TrustpilotSlider = () => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  // Avis Trustpilot réels depuis https://fr.trustpilot.com/review/mynotary.io?languages=all
  // Avis 4* et 5* uniquement
  const reviews = [
    {
      id: 1,
      rating: 5,
      author: "Kyle Fournier",
      country: "FR",
      reviewCount: 109,
      headline: "Javais besoin dune procuration notariée…",
      content: "Javais besoin dune procuration notariée pour vendre un bien immobilier alors que jétais en déplacement. Tout fait par appel vidéo, le notaire a bien vérifié chaque détail. Top.",
      avatar: "https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/60ec27fd-fb21-4674-afc5-e59b20a09600/f=webp,q=80"
    },
    {
      id: 2,
      rating: 5,
      author: "Julia Booker",
      country: "US",
      reviewCount: 26,
      headline: "Certified passport copy for a bank…",
      content: "Certified passport copy for a bank account. Done in 20 min. Perfect.",
      avatar: "https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/77565b98-8a68-4d82-81c2-83cfd8baeb00/f=webp,q=80"
    },
    {
      id: 3,
      rating: 5,
      author: "Julie",
      country: "DE",
      reviewCount: 4,
      headline: "Traduction certifiée de mon relevé de…",
      content: "Traduction certifiée de mon relevé de notes pour une candidature en Suède. Accepté sans problème.",
      avatar: "https://ui-avatars.com/api/?name=Julie&background=3B82F6&color=fff&size=80&bold=true"
    },
    {
      id: 4,
      rating: 5,
      author: "Robbo",
      country: "IT",
      reviewCount: 36,
      headline: "Power of attorney sorted from my living…",
      content: "Power of attorney sorted from my living room. Didnt have to take time off work.",
      avatar: "https://ui-avatars.com/api/?name=Robbo&background=10B981&color=fff&size=80&bold=true"
    },
    {
      id: 5,
      rating: 5,
      author: "Gabriele Angelotti",
      country: "DE",
      reviewCount: 2,
      headline: "Ma banque demandait une copie certifiée…",
      content: "Ma banque demandait une copie certifiée de mon passeport pour finaliser louverture de mon compte pro. Fait en une session, notaire dispo et sympa.",
      avatar: "https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d631b594-34de-424a-fa38-cd4502366600/f=webp,q=80"
    },
    {
      id: 6,
      rating: 5,
      author: "Helen White",
      country: "DE",
      reviewCount: 71,
      headline: "Apostille pour un document officiel",
      content: "Apostille pour un document officiel, service carré.",
      avatar: "https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/8a0a2881-30fa-4f23-a460-471be870d700/f=webp,q=80"
    },
    {
      id: 7,
      rating: 5,
      author: "Romano",
      country: "PT",
      reviewCount: 37,
      headline: "I run a small import business and…",
      content: "I run a small import business and needed several documents notarized for customs. My Notary handled everything professionally and the documents were accepted by authorities in three different countries. Will definitely be using them again.",
      avatar: "https://ui-avatars.com/api/?name=Romano&background=6366F1&color=fff&size=80&bold=true"
    },
    {
      id: 8,
      rating: 5,
      author: "Denis Dubrovin",
      country: "GB",
      reviewCount: 120,
      headline: "Copie certifiée passeport pour un…",
      content: "Copie certifiée passeport pour un dossier dimmigration. Nickel.",
      avatar: "https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/23712022-5064-4860-3253-b2d73119f100/f=webp,q=80"
    },
    {
      id: 9,
      rating: 5,
      author: "Ulvi",
      country: "GB",
      reviewCount: 140,
      headline: "Good service for signature…",
      content: "Good service for signature notarization. Had a small wait before the video call started but otherwise smooth.",
      avatar: "https://ui-avatars.com/api/?name=Ulvi&background=F97316&color=fff&size=80&bold=true"
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
                className="w-[320px] md:w-[380px] flex-shrink-0 flex"
              >
                <div className="bg-white rounded-xl p-5 h-full flex flex-col">
                  {/* Header avec avatar et infos auteur */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Nom et infos */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
                      <p className="text-gray-500 text-xs">{review.country} • {review.reviewCount} avis</p>
                    </div>
                  </div>

                  {/* Étoiles Trustpilot - image officielle */}
                  <div className="mb-3">
                    <img
                      src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/ec7e0448-41ea-4fef-ee59-b617ab362f00/public"
                      alt="5 stars"
                      className="h-5 w-auto"
                      loading="lazy"
                    />
                  </div>

                  {/* Headline */}
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1">
                    {review.headline}
                  </h4>

                  {/* Contenu de l'avis */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow line-clamp-4">
                    {review.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
};

export default TrustpilotSlider;
