'use client'

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { useServicesList } from '../hooks/useServices';
import { formatServicesForLanguage } from '../utils/services';
import { fuzzySearchServices } from '../utils/fuzzySearch';
import PriceDisplay from './PriceDisplay';

// ANALYTICS DIFFÉRÉS - Plausible + Segment (GA4)
let trackServiceClick = null;

// Charger Analytics (Plausible + Segment) de manière non-bloquante
const loadAnalytics = () => {
  if (trackServiceClick) return;
  import('../utils/analytics').then((analytics) => {
    trackServiceClick = analytics.trackServiceClick;
  }).catch(() => {});
};

// Helper pour tracker de manière non-bloquante
const safeTrack = (fn, ...args) => {
  if (fn) {
    try { fn(...args); } catch { /* ignore */ }
  }
};

// Précharger après 2s
if (typeof window !== 'undefined') {
  setTimeout(loadAnalytics, 2000);
}

const Services = ({ servicesData = null }) => {
  const { getLocalizedPath, language } = useLanguage();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6;
  
  // Toujours utiliser le hook pour garantir l'ordre des hooks
  const hookResult = useServicesList({ showInListOnly: true });
  
  // Si on a des données SSR, les utiliser, sinon fallback sur le hook
  const allServices = servicesData 
    ? formatServicesForLanguage(servicesData.filter(s => s.show_in_list === true), language)
    : hookResult.services;
  const isLoading = servicesData ? false : hookResult.isLoading;

  // Extraire toutes les catégories uniques avec leurs libellés traduits
  // Utiliser category_label pour l'affichage mais garder category pour le filtrage
  const categories = useMemo(() => {
    // Créer un map pour associer chaque catégorie de référence à son libellé traduit
    const categoryMap = new Map();
    
    allServices.forEach(service => {
      const categoryRef = service.category || 'general';
      const categoryLabel = service.category_label || categoryRef;
      
      // Stocker le libellé traduit pour chaque catégorie de référence
      if (!categoryMap.has(categoryRef)) {
        categoryMap.set(categoryRef, {
          ref: categoryRef,
          label: categoryLabel,
        });
      }
    });
    
    // Retourner les catégories triées par libellé traduit
    return Array.from(categoryMap.values())
      .sort((a, b) => a.label.localeCompare(b.label, language));
  }, [allServices, language]);

  // Filtrer par catégorie d'abord, puis recherche
  const filteredServices = useMemo(() => {
    let filtered = allServices;
    
    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => (service.category || 'general') === selectedCategory);
    }
    
    // Ensuite appliquer la recherche floue
    return fuzzySearchServices(filtered, searchQuery);
  }, [selectedCategory, searchQuery, allServices]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  // Réinitialiser la page quand la recherche ou la catégorie change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <section id="services" className="py-20 px-4 sm:px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            {t('services.title')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 scroll-slide-up">
            {t('services.heading')}<br />
            <span>{t('services.headingHighlight')}</span>
          </h2>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6 max-w-2xl mx-auto px-1 md:px-0">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder={t('services.searchPlaceholder') || 'Search services...'}
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

        {/* Filtre par catégorie */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2 px-1 md:px-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('services.categories.all') || 'All'}
            </button>
            {categories.map((category) => (
              <button
                key={category.ref}
                onClick={() => setSelectedCategory(category.ref)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === category.ref
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 rounded-2xl p-6 h-48"></div>
                ))}
              </div>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20">
            {searchQuery ? (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-gray-600 text-lg mb-2">
                  {t('services.noResults') || 'No services found'}
                </p>
                <p className="text-gray-500 text-sm">
                  {t('services.tryDifferentSearch') || 'Try a different search term'}
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-lg">{t('services.noServices')}</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedServices.filter(s => s && s.service_id).map((service) => {
              const servicePath = `/services/${service.service_id}`;
              const localizedPath = getLocalizedPath ? getLocalizedPath(servicePath) : servicePath;
              const finalPath = localizedPath || servicePath;
              
              const handleServiceClick = (e) => {
                e.preventDefault();
                loadAnalytics();
                safeTrack(trackServiceClick, service.service_id, service.name, 'homepage_services');
                // Forcer un rechargement complet de la page
                window.location.href = finalPath;
              };
              
              return (
                <Link
                  key={service.id || service.service_id}
                  href={finalPath}
                  className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 scroll-slide-up h-full flex flex-col"
                  onClick={handleServiceClick}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{service.list_title || service.name}</h3>
                  </div>

                  <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed flex-1">{service.short_description || service.description}</p>

                  <div className="flex flex-col gap-3 mt-auto items-center pt-4 border-t border-gray-200">
                    <div className="inline-flex items-center gap-2 group-hover:gap-3 transition-all justify-center text-sm font-semibold text-black underline underline-offset-4 decoration-2">
                      <span className="btn-text inline-block">{t('services.learnMore')}</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    {service.base_price && (
                      <div className="flex items-center gap-2 justify-center">
                        <PriceDisplay price={service.base_price} showFrom className="text-lg font-bold text-gray-900" />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = [];
                      let lastPage = 0;
                      
                      for (let page = 1; page <= totalPages; page++) {
                        // Toujours afficher la première et dernière page
                        if (page === 1 || page === totalPages) {
                          if (page - lastPage > 1) {
                            pages.push(
                              <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          pages.push(
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 rounded-lg border transition-colors ${
                                currentPage === page
                                  ? 'bg-black text-white border-black'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                              aria-label={`Page ${page}`}
                              aria-current={currentPage === page ? 'page' : undefined}
                            >
                              {page}
                            </button>
                          );
                          lastPage = page;
                        }
                        // Afficher les pages autour de la page actuelle
                        else if (page >= currentPage - 1 && page <= currentPage + 1) {
                          if (page - lastPage > 1) {
                            pages.push(
                              <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          pages.push(
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 rounded-lg border transition-colors ${
                                currentPage === page
                                  ? 'bg-black text-white border-black'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                              aria-label={`Page ${page}`}
                              aria-current={currentPage === page ? 'page' : undefined}
                            >
                              {page}
                            </button>
                          );
                          lastPage = page;
                        }
                      }
                      
                      return pages;
                    })()}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {t('services.showing') || 'Showing'} {startIndex + 1}-{Math.min(endIndex, filteredServices.length)} {t('services.of') || 'of'} {filteredServices.length} {t('services.services') || 'services'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Services;
