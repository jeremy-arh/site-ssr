'use client'

import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const Testimonial = memo(({ testimonialsData = null }) => {
  const { language } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);
  const mouseStartX = useRef(0);
  const mouseEndX = useRef(0);
  const isMouseDown = useRef(false);


  // URLs des images de portraits
  const portraitImages = {
    female: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/1e255017-d3a6-49f7-1711-c20730082e00/f=webp,q=05',
    male1: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/359b0805-b5c7-421c-5a5d-a2645bccb300/f=webp,q=05',
    male2: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/c461a6db-6f5f-47ae-5016-9d1780abac00/f=webp,q=05',
  };

  // Fallback testimonials si pas de données SSR (3 témoignages : 1 femme, 2 hommes)
  const defaultTestimonials = [
    {
      quote: language === 'en' ? '"A smooth and fully digital experience"' : language === 'fr' ? '"Enfin une solution simple et efficace"' : language === 'es' ? '"Por fin una solución simple y eficaz"' : language === 'de' ? '"Ein reibungsloses und vollständig digitales Erlebnis"' : language === 'it' ? '"Un\'esperienza fluida e completamente digitale"' : '"Uma experiência suave e totalmente digital"',
      text: language === 'en' ? 'My Notary made what used to be a complex process incredibly simple. I was able to sign, certify, and apostille my documents online, fully legally, in just a few minutes. Their team is responsive, reliable, and the platform is extremely intuitive' : language === 'fr' ? 'J\'avais besoin de faire certifier plusieurs documents pour mon entreprise. Avec My Notary, tout s\'est fait en ligne en quelques minutes, sans me déplacer. L\'équipe est réactive, le processus est clair et mes documents sont valides partout. Je recommande vivement !' : language === 'es' ? 'Necesitaba certificar varios documentos para mi empresa. Con My Notary, todo se hizo en línea en pocos minutos, sin desplazarme. El equipo es receptivo, el proceso es claro y mis documentos son válidos en todas partes. ¡Lo recomiendo totalmente!' : language === 'de' ? 'My Notary hat einen Prozess, der früher komplex war, unglaublich einfach gemacht. Ich konnte meine Dokumente online, vollständig legal, in nur wenigen Minuten signieren, zertifizieren und apostillieren. Ihr Team ist reaktionsschnell, zuverlässig und die Plattform ist extrem intuitiv' : language === 'it' ? 'My Notary ha reso incredibilmente semplice quello che era un processo complesso. Ho potuto firmare, certificare e apostillare i miei documenti online, completamente legalmente, in pochi minuti. Il loro team è reattivo, affidabile e la piattaforma è estremamente intuitiva' : 'My Notary tornou incrivelmente simples o que costumava ser um processo complexo. Consegui assinar, certificar e apostilar meus documentos online, totalmente legalmente, em apenas alguns minutos. A equipe deles é responsiva, confiável e a plataforma é extremamente intuitiva',
      author: 'Callum Davis',
      role: language === 'en' ? 'CEO of Akkar' : language === 'fr' ? 'PDG d\'Akkar' : language === 'es' ? 'CEO de Akkar' : language === 'de' ? 'CEO von Akkar' : language === 'it' ? 'CEO di Akkar' : 'CEO da Akkar',
      image: portraitImages.male1,
      gender: 'male',
    },
    {
      quote: language === 'en' ? '"Fast, secure, and incredibly efficient"' : language === 'fr' ? '"Rapide, sécurisé et incroyablement efficace"' : language === 'es' ? '"Rápido, seguro e increíblemente eficiente"' : language === 'de' ? '"Schnell, sicher und unglaublich effizient"' : language === 'it' ? '"Veloce, sicuro e incredibilmente efficiente"' : '"Rápido, seguro e incrivelmente eficiente"',
      text: language === 'en' ? 'I needed to notarize documents for an international business deal. The entire process took less than 20 minutes, and I received my apostilled documents the same day. The platform is user-friendly and the support team was extremely helpful throughout the process.' : language === 'fr' ? 'J\'avais besoin de faire notariser des documents pour une transaction commerciale internationale. Tout le processus a pris moins de 20 minutes, et j\'ai reçu mes documents apostillés le jour même. La plateforme est conviviale et l\'équipe de support a été extrêmement utile tout au long du processus.' : language === 'es' ? 'Necesitaba notarizar documentos para un acuerdo comercial internacional. Todo el proceso tomó menos de 20 minutos y recibí mis documentos apostillados el mismo día. La plataforma es fácil de usar y el equipo de soporte fue extremadamente útil durante todo el proceso.' : language === 'de' ? 'Ich musste Dokumente für ein internationales Geschäftsabkommen notariell beglaubigen lassen. Der gesamte Prozess dauerte weniger als 20 Minuten und ich erhielt meine apostillierten Dokumente noch am selben Tag. Die Plattform ist benutzerfreundlich und das Support-Team war während des gesamten Prozesses äußerst hilfreich.' : language === 'it' ? 'Avevo bisogno di notarizzare documenti per un accordo commerciale internazionale. L\'intero processo ha richiesto meno di 20 minuti e ho ricevuto i miei documenti apostillati lo stesso giorno. La piattaforma è user-friendly e il team di supporto è stato estremamente utile durante tutto il processo.' : 'Precisava notarizar documentos para um acordo comercial internacional. Todo o processo levou menos de 20 minutos e recebi meus documentos apostilados no mesmo dia. A plataforma é fácil de usar e a equipe de suporte foi extremamente útil durante todo o processo.',
      author: 'Sarah Martinez',
      role: language === 'en' ? 'Legal Director' : language === 'fr' ? 'Directrice Juridique' : language === 'es' ? 'Directora Legal' : language === 'de' ? 'Rechtsdirektorin' : language === 'it' ? 'Direttore Legale' : 'Diretora Jurídica',
      image: portraitImages.female,
      gender: 'female',
    },
    {
      quote: language === 'en' ? '"The best online notarization service I\'ve used"' : language === 'fr' ? '"Le meilleur service de notarisation en ligne que j\'ai utilisé"' : language === 'es' ? '"El mejor servicio de notarización en línea que he usado"' : language === 'de' ? '"Der beste Online-Notarisierungsservice, den ich verwendet habe"' : language === 'it' ? '"Il miglior servizio di notarizzazione online che ho usato"' : '"O melhor serviço de notarização online que usei"',
      text: language === 'en' ? 'As someone who travels frequently, having access to online notarization has been a game-changer. I can get my documents certified from anywhere in the world, and the quality is always excellent. Highly recommend My Notary for anyone needing reliable notarization services.' : language === 'fr' ? 'En tant que personne qui voyage fréquemment, avoir accès à la notarisation en ligne a été un changement majeur. Je peux faire certifier mes documents depuis n\'importe où dans le monde, et la qualité est toujours excellente. Je recommande vivement My Notary à tous ceux qui ont besoin de services de notarisation fiables.' : language === 'es' ? 'Como alguien que viaja con frecuencia, tener acceso a la notarización en línea ha sido un cambio total. Puedo certificar mis documentos desde cualquier parte del mundo, y la calidad siempre es excelente. Recomiendo encarecidamente My Notary a cualquiera que necesite servicios de notarización confiables.' : language === 'de' ? 'Als jemand, der häufig reist, war der Zugang zur Online-Notarisierung ein Wendepunkt. Ich kann meine Dokumente von überall auf der Welt beglaubigen lassen, und die Qualität ist immer ausgezeichnet. Ich empfehle My Notary wärmstens für alle, die zuverlässige Notarisierungsdienste benötigen.' : language === 'it' ? 'Come qualcuno che viaggia frequentemente, avere accesso alla notarizzazione online è stato un punto di svolta. Posso far certificare i miei documenti da qualsiasi parte del mondo e la qualità è sempre eccellente. Consiglio vivamente My Notary a chiunque abbia bisogno di servizi di notarizzazione affidabili.' : 'Como alguém que viaja frequentemente, ter acesso à notarização online foi um divisor de águas. Posso certificar meus documentos de qualquer lugar do mundo, e a qualidade é sempre excelente. Recomendo muito o My Notary para qualquer pessoa que precise de serviços de notarização confiáveis.',
      author: 'Michael Chen',
      role: language === 'en' ? 'International Business Consultant' : language === 'fr' ? 'Consultant en Affaires Internationales' : language === 'es' ? 'Consultor de Negocios Internacionales' : language === 'de' ? 'Internationaler Unternehmensberater' : language === 'it' ? 'Consulente Aziendale Internazionale' : 'Consultor de Negócios Internacionais',
      image: portraitImages.male2,
      gender: 'male',
    },
  ];

  // Fonction pour déterminer le genre et assigner l'image appropriée
  const getImageForTestimonial = (testimonial, index) => {
    // Si une image est déjà fournie, l'utiliser
    if (testimonial.image || testimonial.image_url) {
      return testimonial.image || testimonial.image_url;
    }
    
    // Déterminer le genre
    const gender = testimonial.gender || testimonial.author_gender;
    const authorName = (testimonial.author_name || testimonial.author || '').toLowerCase();
    const role = (testimonial[`role_${language}`] || testimonial.role_en || testimonial.role || '').toLowerCase();
    
    // Indices pour déterminer le genre (français, anglais, espagnol, etc.)
    const femaleIndicators = ['directrice', 'directora', 'avocate', 'abogada', 'advogada', 'direktorin', 'direttore', 'directrice juridique', 'directora legal', 'corporate lawyer', 'legal director', 'avocate d\'entreprise', 'abogada corporativa'];
    const isFemale = gender === 'female' || femaleIndicators.some(indicator => role.includes(indicator));
    
    // Si on a des données SSR, limiter à 3 témoignages max
    if (isFemale) {
      return portraitImages.female;
    } else {
      // Alterner entre les deux images masculines
      return index % 2 === 0 ? portraitImages.male1 : portraitImages.male2;
    }
  };

  // Utiliser les données SSR si disponibles, sinon fallback
  // Limiter à 3 témoignages maximum
  const testimonials = testimonialsData && testimonialsData.length > 0
    ? testimonialsData.slice(0, 3).map((testimonial, index) => ({
        quote: testimonial[`quote_${language}`] || testimonial.quote_en || testimonial.quote,
        text: testimonial[`text_${language}`] || testimonial.text_en || testimonial.text,
        author: testimonial.author_name || testimonial.author,
        role: testimonial[`role_${language}`] || testimonial.role_en || testimonial.role,
        image: getImageForTestimonial(testimonial, index),
      }))
    : defaultTestimonials;

  // Fonction pour changer d'avis
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Gestion du swipe tactile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = true;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Distance minimale pour déclencher un swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe vers la gauche = avancer
        goToNext();
      } else {
        // Swipe vers la droite = reculer
        goToPrevious();
      }
    }

    isSwiping.current = false;
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Gestion du swipe avec la souris (pour trackpad)
  const handleMouseDown = (e) => {
    mouseStartX.current = e.clientX;
    isMouseDown.current = true;
  };

  const handleMouseMove = (e) => {
    if (isMouseDown.current) {
      mouseEndX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    if (!isMouseDown.current) return;
    
    const swipeDistance = mouseStartX.current - mouseEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    isMouseDown.current = false;
    mouseStartX.current = 0;
    mouseEndX.current = 0;
  };

  // Auto-rotation toutes les 5 secondes (seulement si pas de swipe en cours)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSwiping.current && !isMouseDown.current) {
        goToNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, goToNext]);

  return (
    <section className="pt-16 md:pt-24 pb-10 md:pb-16 px-4 sm:px-[30px] bg-white overflow-hidden scroll-mt-28 md:scroll-mt-32">
      <div className="max-w-[1100px] mx-auto scroll-fade-in">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Carousel */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center space-y-6 relative min-h-[360px] sm:min-h-[420px]">
            <div 
              className="relative overflow-hidden cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 px-1 sm:px-4"
                  >
                    <div className="mb-5 sm:mb-6 pt-2 sm:pt-4">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 leading-snug">
                        {testimonial.quote}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed lg:text-lg">
                      {testimonial.text}
                    </p>

                    <div className="pt-5 sm:pt-6 flex items-center gap-4">
                      {testimonial.image && (
                        <img
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className="text-left">
                        <div className="text-base sm:text-lg font-semibold text-gray-900">{testimonial.author}</div>
                        <div className="text-[11px] sm:text-xs text-gray-600 font-medium uppercase tracking-wide mt-0.5">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-gray-900 w-10' : 'bg-gray-300 w-3'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Testimonial.displayName = 'Testimonial';

export default Testimonial;
