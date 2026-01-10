'use client'

import { useState, useMemo } from 'react';
import { fuzzySearchFAQs } from '../utils/fuzzySearch';
import { useTranslation } from '../hooks/useTranslation';

const FAQ = ({ faqsData = null }) => {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  // Debug en développement
  // eslint-disable-next-line no-undef
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[FAQ Component Debug]', {
      faqsData,
      faqsDataType: typeof faqsData,
      isArray: Array.isArray(faqsData),
      length: faqsData?.length,
      language
    })
  }

  // Fallback FAQs si pas de données SSR
  const defaultFaqs = useMemo(() => [
    {
      question: 'How does the online notarization process work?',
      answer: 'Everything happens in just a few minutes, directly from your browser. You schedule a secure video session with a licensed notary, sign your document remotely, and the notarization is completed in real time. Your notarized document is immediately uploaded and available on the platform, accompanied by its digital certification.'
    },
    {
      question: 'Are my documents officially recognized internationally?',
      answer: 'Yes. All documents notarized through our platform can receive an apostille issued in accordance with The Hague Convention of 5 October 1961. This apostille certifies the authenticity of the notary\'s signature and seal, ensuring the international validity of your document across all member countries.'
    },
    {
      question: 'What types of documents can I have certified?',
      answer: 'You can notarize and certify a wide range of documents, including:\n- Contracts, declarations, affidavits, and simple powers of attorney\n- Certified true copies (IDs, diplomas, certificates)\n- Certified translations Business and administrative documents\nEach document is securely signed, sealed, and stored within your private space.'
    },
    {
      question: 'How is my data protected?',
      answer: 'All transfers are end-to-end encrypted (AES-256) and stored on secure servers that comply with international data protection standards. Video sessions are recorded and archived under strict control to ensure integrity, traceability, and full confidentiality for every notarization.'
    },
    {
      question: 'When will I receive my final document?',
      answer: 'Immediately after the end of your video session with the notary, your notarized document is automatically available in your secure dashboard. You receive your notarized document right away, without any delay. If an apostille is required, it is added once validated by the competent authority — and the final certified document becomes available for instant download.'
    },
  ], []);

  // Utiliser les données SSR si disponibles, sinon fallback
  // Vérifier que faqsData est un tableau non vide
  const hasValidFaqsData = faqsData && Array.isArray(faqsData) && faqsData.length > 0
  
  const faqs = useMemo(() => {
    if (!hasValidFaqsData) {
      // Pour les FAQs par défaut, ajouter originalIndex
      return defaultFaqs.map((faq, index) => ({
        ...faq,
        originalIndex: index,
      }));
    }
    
    // Mapper et formater les FAQs dynamiques
    const formattedFaqs = faqsData
      .map((faq, index) => ({
        question: faq[`question_${language}`] || faq.question_en || faq.question || '',
        answer: faq[`answer_${language}`] || faq.answer_en || faq.answer || '',
        order: faq.order !== undefined ? faq.order : index + 1, // Utiliser order si présent, sinon index
        originalIndex: index, // Garder l'index original pour le toggle
      }))
      .filter(faq => faq.question && faq.answer) // Filtrer les FAQs incomplètes
      .sort((a, b) => (a.order || 0) - (b.order || 0)); // Trier par order
    
    return formattedFaqs.length > 0 ? formattedFaqs : defaultFaqs.map((faq, index) => ({
      ...faq,
      originalIndex: index,
    }));
  }, [faqsData, language, hasValidFaqsData, defaultFaqs]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Utiliser les FAQs traduites
  // Si on a des FAQs dynamiques (depuis Supabase), les utiliser directement
  // Sinon, essayer de récupérer les traductions depuis le fichier de traduction
  const translatedFAQs = useMemo(() => {
    // Si on a des FAQs dynamiques, les utiliser directement (elles sont déjà traduites)
    if (hasValidFaqsData) {
      return faqs;
    }
    
    // Sinon, essayer de récupérer les traductions depuis le fichier de traduction
    try {
      const translatedItems = t('faq.items', faqs);
      // Vérifier que translatedItems est un tableau valide
      if (Array.isArray(translatedItems) && translatedItems.length > 0) {
        return translatedItems;
      }
    } catch (error) {
      console.error('Error loading FAQ translations:', error);
    }
    // Fallback sur les FAQs par défaut si la traduction n'est pas disponible
    return faqs;
  }, [faqs, t, hasValidFaqsData]);

  // Recherche floue dans les FAQs
  const filteredFAQs = useMemo(() => {
    return fuzzySearchFAQs(translatedFAQs, searchQuery);
  }, [searchQuery, translatedFAQs]);

  // Ouvrir le chat Crisp
  const openCrispChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open']);
    }
  };

  return (
    <section id="faq" className="py-16 md:py-20 px-2 md:px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-2 bg-black text-white rounded-full text-sm font-semibold mb-3 scroll-fade-in">
            {t('faq.title')}
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mb-8 max-w-2xl mx-auto px-1 md:px-0">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null); // Fermer les FAQs ouvertes lors de la recherche
              }}
              placeholder={t('faq.searchPlaceholder')}
              className="w-full px-5 py-4 pl-12 pr-4 text-gray-900 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400 transition-all duration-300 text-base placeholder-gray-400"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setOpenIndex(null);
                }}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Message si aucun résultat */}
        {searchQuery && filteredFAQs.length === 0 && (
          <div className="text-center py-10 px-2 md:px-4">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any FAQs matching your search. Our team is here to help!
              </p>
              <button
                onClick={openCrispChat}
                className="inline-block px-5 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
              >
                Contact us
              </button>
            </div>
          </div>
        )}

        {/* Liste des FAQs filtrées */}
        <div className="space-y-4 px-0 md:px-0">
          {filteredFAQs.map((faq, displayIndex) => {
            // Utiliser l'index de display pour le toggle (après tri et filtrage)
            const faqIndex = faq.originalIndex !== undefined ? faq.originalIndex : displayIndex;
            const isOpen = openIndex === faqIndex;
            
            return (
            <div
              key={`faq-${faqIndex}-${displayIndex}-${faq.question?.substring(0, 20)}`}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 scroll-slide-up"
            >
              <button
                onClick={() => toggleFAQ(faqIndex)}
                className="w-full px-5 py-4 md:px-6 md:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-300 group"
              >
                <span className="text-base md:text-lg font-bold text-gray-900 pr-4 transition-all">{faq.question}</span>
                <div className={`w-8 h-8 flex items-center justify-center transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? 'rotate-180' : ''
                }`}>
                  <svg
                    className={`w-5 h-5 ${isOpen ? '' : 'text-gray-900'}`}
                    fill={isOpen ? "url(#faq-gradient)" : "currentColor"}
                    viewBox="0 0 16 16"
                  >
                    <defs>
                      <linearGradient id="faq-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#491AE9" />
                        <stop offset="33%" stopColor="#D414E5" />
                        <stop offset="66%" stopColor="#FC03A1" />
                        <stop offset="100%" stopColor="#FF7715" />
                      </linearGradient>
                    </defs>
                    <path d="M8.00045 8.78092L11.3003 5.48111L12.2431 6.42392L8.00045 10.6666L3.75781 6.42392L4.70063 5.48111L8.00045 8.78092Z" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 md:px-6 pb-5 animate-slide-up">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
