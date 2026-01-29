'use client'

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { getCanonicalUrl } from '../utils/canonicalUrl';

/**
 * Mapping des codes de langue vers les noms de pays pour Schema.org
 */
const LANGUAGE_TO_COUNTRY = {
  en: 'Worldwide',
  fr: 'France',
  es: 'Spain',
  de: 'Germany',
  it: 'Italy',
  pt: 'Portugal',
};

/**
 * Composant pour générer les données structurées Schema.org (JSON-LD)
 * Améliore le référencement en permettant aux moteurs de recherche de mieux comprendre le contenu
 */
const StructuredData = ({ 
  type = 'Organization',
  data = {},
  additionalData = []
}) => {
  const pathname = usePathname();
  const { language } = useLanguage();
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}`
    : 'https://mynotary.io';

  // Données de base pour l'organisation
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'My Notary',
    alternateName: 'mynotary.io',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: language === 'en' 
      ? 'Notarize and apostille your documents 100% online. Secure, legally valid, and recognized internationally through the Hague Convention.'
      : 'Notarisez et apostillez vos documents 100% en ligne. Sécurisé, légalement valide et reconnu internationalement grâce à la Convention de La Haye.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@mynotary.io',
      availableLanguage: ['en', 'fr', 'es', 'de', 'it', 'pt'],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '10',
      url: 'https://www.trustpilot.com/review/mynotary.io',
    },
    sameAs: [
      // Ajouter les réseaux sociaux si disponibles
    ],
    ...data,
  };

  // Générer les scripts JSON-LD selon le type
  const generateScripts = () => {
    const scripts = [];

    // Toujours inclure l'organisation sur toutes les pages
    scripts.push({
      type: 'Organization',
      data: organizationData,
    });

    // Ajouter les données supplémentaires
    if (additionalData && Array.isArray(additionalData)) {
      additionalData.forEach((item) => {
        // Traitement spécial pour FAQPage
        if (item.type === 'FAQPage' && item.data && item.data.faqItems && Array.isArray(item.data.faqItems)) {
          scripts.push({
            type: 'FAQPage',
            data: {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: item.data.faqItems.map((faqItem) => ({
                '@type': 'Question',
                name: faqItem.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faqItem.answer,
                },
              })),
            },
          });
        } else if (item.type === 'BreadcrumbList' && item.data && item.data.items && Array.isArray(item.data.items)) {
          // Traitement spécial pour BreadcrumbList
          scripts.push({
            type: 'BreadcrumbList',
            data: {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: item.data.items.map((breadcrumbItem, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: breadcrumbItem.name,
                item: breadcrumbItem.url ? `${baseUrl}${breadcrumbItem.url}` : getCanonicalUrl(pathname),
              })),
            },
          });
        } else {
          // Pour les autres types, traitement standard avec vérification de @type
          const schemaData = {
            '@context': 'https://schema.org',
            ...item.data,
          };
          
          // S'assurer que @type est présent si un type est spécifié
          if (item.type && !schemaData['@type']) {
            schemaData['@type'] = item.type;
          }
          
          scripts.push({
            type: item.type || 'Thing',
            data: schemaData,
          });
        }
      });
    }

    // Ajouter les données spécifiques selon le type
    if (type === 'Service' && (data.serviceName || data.name)) {
      const serviceData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: data.serviceName || data.name,
        description: data.serviceDescription || data.description || '',
        provider: {
          '@type': 'Organization',
          name: 'My notary',
          url: baseUrl,
        },
        areaServed: {
          '@type': 'Country',
          name: LANGUAGE_TO_COUNTRY[language] || LANGUAGE_TO_COUNTRY['en'],
        },
      };
      
      // Ajouter @id si fourni
      if (data['@id']) {
        serviceData['@id'] = data['@id'];
      }
      
      // Fusionner avec les autres données (sans écraser les champs déjà définis)
      Object.keys(data).forEach(key => {
        if (!['serviceName', 'serviceDescription', 'name', 'description'].includes(key)) {
          serviceData[key] = data[key];
        }
      });
      
      scripts.push({
        type: 'Service',
        data: serviceData,
      });
    }

    if (type === 'Article' && data.headline) {
      scripts.push({
        type: 'Article',
        data: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.headline,
          description: data.description || '',
          image: data.image || `${baseUrl}/og-image.jpg`,
          datePublished: data.datePublished || new Date().toISOString(),
          dateModified: data.dateModified || new Date().toISOString(),
          author: {
            '@type': 'Organization',
            name: 'My notary',
          },
          publisher: {
            '@type': 'Organization',
            name: 'My notary',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': getCanonicalUrl(pathname),
          },
          ...data,
        },
      });
    }

    if (type === 'FAQPage' && data.faqItems && Array.isArray(data.faqItems)) {
      scripts.push({
        type: 'FAQPage',
        data: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        },
      });
    }

    if (type === 'BreadcrumbList' && data.items && Array.isArray(data.items)) {
      scripts.push({
        type: 'BreadcrumbList',
        data: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url ? `${baseUrl}${item.url}` : getCanonicalUrl(pathname),
          })),
        },
      });
    }

    return scripts;
  };

  const scripts = generateScripts();

  // Ajouter les scripts JSON-LD dans le head
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const head = document.head;
    const scriptIds = scripts.map((_, index) => `structured-data-${scripts[index].type}-${index}`);

    // Supprimer les anciens scripts
    scriptIds.forEach(id => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    });

    // Ajouter les nouveaux scripts
    scripts.forEach((script, index) => {
      const scriptElement = document.createElement('script');
      scriptElement.id = scriptIds[index];
      scriptElement.type = 'application/ld+json';
      scriptElement.textContent = JSON.stringify(script.data);
      head.appendChild(scriptElement);
    });

    // Cleanup
    return () => {
      scriptIds.forEach(id => {
        const existing = document.getElementById(id);
        if (existing) existing.remove();
      });
    };
  }, [scripts]);

  return null;
};

export default StructuredData;

