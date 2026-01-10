'use client'

import Image from 'next/image';
import { useTranslation } from '../hooks/useTranslation';

// SVG inline pour éviter les requêtes réseau à @iconify (320ms de latence)
const IconChat = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C6.5 3 2 6.58 2 11a7.218 7.218 0 0 0 2.75 5.5c0 .6-.42 2.17-2.75 4.5c2.37-.11 4.64-1 6.47-2.5c1.14.33 2.34.5 3.53.5c5.5 0 10-3.58 10-8s-4.5-8-10-8m0 14c-4.42 0-8-2.69-8-6s3.58-6 8-6s8 2.69 8 6s-3.58 6-8 6z"/>
  </svg>
);

const ChatCTA = () => {
  const { language } = useTranslation();

  // Charger Crisp si nécessaire
  const ensureCrispLoaded = () => {
    if (typeof window === 'undefined') {
      return false;
    }

    // Si Crisp est déjà initialisé, retourner true
    if (window.$crisp && typeof window.$crisp.push === 'function') {
      return true;
    }

    // Vérifier si le script Crisp existe dans le DOM
    const crispScript = document.querySelector('script[src*="client.crisp.chat"]');
    if (crispScript) {
      // Le script est présent, attendre qu'il se charge
      return false;
    }

    // Le script n'existe pas, l'initialiser
    if (!window.$crisp) {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "fd0c2560-46ba-4da6-8979-47748ddf247a";
    }

    // Créer et charger le script Crisp
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);

    return false;
  };

  // Ouvrir le chat Crisp
  const openCrispChat = () => {
    if (typeof window === 'undefined') {
      return;
    }

    // S'assurer que Crisp est chargé
    ensureCrispLoaded();

    // Fonction pour vérifier si Crisp est prêt et ouvrir le chat
    const tryOpenChat = () => {
      if (typeof window === 'undefined') {
        return false;
      }

      // Vérifier que $crisp existe et a la méthode push
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        try {
          window.$crisp.push(['do', 'chat:open']);
          return true;
        } catch (error) {
          console.error('Erreur lors de l\'ouverture de Crisp:', error);
          return false;
        }
      }
      return false;
    };

    // Essayer d'ouvrir immédiatement
    if (tryOpenChat()) {
      return;
    }

    // Si Crisp n'est pas encore prêt, attendre avec plusieurs tentatives
    let attempts = 0;
    const maxAttempts = 30; // 6 secondes max (30 * 200ms) - augmenté pour la prod
    const interval = setInterval(() => {
      attempts++;
      if (tryOpenChat()) {
        clearInterval(interval);
        return;
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn('Crisp n\'a pas pu être chargé après plusieurs tentatives');
        // Fallback: essayer quand même une dernière fois après un délai plus long
        setTimeout(() => {
          if (window.$crisp && typeof window.$crisp.push === 'function') {
            try {
              window.$crisp.push(['do', 'chat:open']);
            } catch (error) {
              console.error('Erreur finale lors de l\'ouverture de Crisp:', error);
            }
          } else {
            // Dernier recours: recharger Crisp
            ensureCrispLoaded();
            setTimeout(() => {
              if (window.$crisp && typeof window.$crisp.push === 'function') {
                try {
                  window.$crisp.push(['do', 'chat:open']);
                } catch (error) {
                  console.error('Erreur lors de la dernière tentative:', error);
                }
              }
            }, 2000);
          }
        }, 1000);
      }
    }, 200);
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
    <section className="py-12 px-4 sm:px-[30px] bg-white">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col items-center justify-center text-center rounded-2xl bg-gray-50 border border-gray-200 py-8 px-6">
          <div className="relative mb-6">
            <Image
              src="/images/chat-cta.webp"
              alt="Agent support"
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md"
            />
            {/* Point vert pour indiquer "en ligne" */}
            <span className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse">
              <span className="absolute inset-0 bg-green-500 rounded-full animate-ping"></span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {content.title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-2xl line-clamp-3">
            {content.text}
          </p>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-200 shadow-md"
            onClick={openCrispChat}
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

