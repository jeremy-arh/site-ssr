'use client'

import Image from 'next/image';
import { useTranslation } from '../hooks/useTranslation';
import { openCrispChat } from '../utils/crisp';

// SVG inline pour éviter les requêtes réseau à @iconify (320ms de latence)
const IconChat = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C6.5 3 2 6.58 2 11a7.218 7.218 0 0 0 2.75 5.5c0 .6-.42 2.17-2.75 4.5c2.37-.11 4.64-1 6.47-2.5c1.14.33 2.34.5 3.53.5c5.5 0 10-3.58 10-8s-4.5-8-10-8m0 14c-4.42 0-8-2.69-8-6s3.58-6 8-6s8 2.69 8 6s-3.58 6-8 6z"/>
  </svg>
);

const ChatCTA = () => {
  const { language } = useTranslation();

  // Ouvrir le chat Crisp en utilisant la fonction utilitaire robuste
  const handleOpenChat = () => {
    openCrispChat({
      maxAttempts: 100, // 20 secondes max pour la production
      intervalMs: 200,
      forceLoad: true
    });
  };

  const translations = {
    en: {
      title: 'Need help with a complex case?',
      text: 'Our expert team is here to help you navigate even the most complex notarization challenges. Whether you have multiple documents, special requirements, or unique circumstances, we\'re ready to assist you with personalized solutions.',
      buttonText: 'Start a conversation'
    },
    fr: {
      title: 'Besoin d\'aide pour un cas complexe ?',
      text: 'Notre équipe d\'experts est là pour vous aider à naviguer même dans les défis de notarisation les plus complexes. Que vous ayez plusieurs documents, des exigences spéciales ou des circonstances uniques, nous sommes prêts à vous assister avec des solutions personnalisées.',
      buttonText: 'Démarrer une conversation'
    },
    es: {
      title: '¿Necesitas ayuda con un caso complejo?',
      text: 'Nuestro equipo de expertos está aquí para ayudarte a navegar incluso los desafíos de notarización más complejos. Ya sea que tengas múltiples documentos, requisitos especiales o circunstancias únicas, estamos listos para asistirte con soluciones personalizadas.',
      buttonText: 'Iniciar conversación'
    },
    de: {
      title: 'Brauchen Sie Hilfe bei einem komplexen Fall?',
      text: 'Unser Expertenteam ist hier, um Ihnen bei der Bewältigung selbst der komplexesten Notarisierungsherausforderungen zu helfen. Ob Sie mehrere Dokumente haben, besondere Anforderungen oder einzigartige Umstände, wir sind bereit, Ihnen mit personalisierten Lösungen zu helfen.',
      buttonText: 'Gespräch beginnen'
    },
    it: {
      title: 'Hai bisogno di aiuto con un caso complesso?',
      text: 'Il nostro team di esperti è qui per aiutarti a navigare anche le sfide di notarizzazione più complesse. Che tu abbia più documenti, requisiti speciali o circostanze uniche, siamo pronti ad assisterti con soluzioni personalizzate.',
      buttonText: 'Inizia una conversazione'
    },
    pt: {
      title: 'Precisa de ajuda com um caso complexo?',
      text: 'Nossa equipe de especialistas está aqui para ajudá-lo a navegar mesmo nos desafios de notarização mais complexos. Seja você tenha vários documentos, requisitos especiais ou circunstâncias únicas, estamos prontos para ajudá-lo com soluções personalizadas.',
      buttonText: 'Iniciar conversa'
    }
  };

  const content = translations[language] || translations.en;

  return (
    <section className="chat-cta-section py-16 md:py-24 lg:py-32 w-full overflow-hidden" style={{ backgroundColor: '#F6F4F1' }}>
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Contenu central */}
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* 2 bulles assemblées au-dessus */}
          <div className="flex items-center justify-center mb-6 md:mb-8">
            {/* Bulle 1 - à gauche, devant */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg z-20">
              <Image
                src="/images/chat-cta.webp"
                alt="Expert 1"
                fill
                className="object-cover"
              />
            </div>
            {/* Bulle 2 - chevauchement léger, derrière */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg z-10" style={{ marginLeft: '-16px' }}>
              <Image
                src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/fdd2c406-8968-42ec-8ebd-21efcd575d00/f=webp,q=80"
                alt="Expert 2"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
            {content.title}
          </h3>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-xl">
            {content.text}
          </p>
          <button
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-200 shadow-lg text-base md:text-lg"
            onClick={handleOpenChat}
          >
            <IconChat />
            <span>{content.buttonText}</span>
          </button>
        </div>
        
      </div>
    </section>
  );
};

export default ChatCTA;

