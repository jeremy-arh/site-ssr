'use client'

import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServiceForLanguage } from '../utils/services';
import Link from 'next/link';
import servicesData from '../../public/data/services.json';

const ServicesDropdown = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [closeTimeout, setCloseTimeout] = useState(null);
  const { t } = useTranslation();
  const { getLocalizedPath, language } = useLanguage();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const formattedServices = useMemo(() => {
    return servicesData
      .filter(service => service.is_active && service.show_in_list)
      .map(service => formatServiceForLanguage(service, language));
  }, [language]);

  const menuSections = useMemo(() => {
    const sections = [];
    const sectionMap = new Map();

    const getCategoryKey = (service) => service.category || 'general';
    const getCategoryLabel = (service) => service.category_label || getCategoryKey(service);

    formattedServices.forEach(service => {
      const categoryKey = getCategoryKey(service);
      if (!sectionMap.has(categoryKey)) {
        const section = {
          key: categoryKey,
          title: getCategoryLabel(service),
          items: []
        };
        sectionMap.set(categoryKey, section);
        sections.push(section);
      }
      const section = sectionMap.get(categoryKey);
      section.items.push({
        label: service.list_title || service.name,
        href: `/services/${service.service_id}`
      });
    });

    return sections;
  }, [formattedServices]);

  // Calculer la position du menu - exactement au bas de la navbar
  useEffect(() => {
    const updateMenuPosition = () => {
      const navbarInner = document.querySelector('.navbar-inner');
      if (navbarInner) {
        const rect = navbarInner.getBoundingClientRect();
        setMenuTop(rect.bottom);
      }
    };

    if (isOpen && !isMobile) {
      updateMenuPosition();
      window.addEventListener('resize', updateMenuPosition);
      window.addEventListener('scroll', updateMenuPosition);
      return () => {
        window.removeEventListener('resize', updateMenuPosition);
        window.removeEventListener('scroll', updateMenuPosition);
      };
    }
  }, [isOpen, isMobile]);


  // Fermer le menu si on clique en dehors
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Fermer le menu au scroll (desktop seulement)
  useEffect(() => {
    if (!isOpen || isMobile) return;

    const handleScroll = () => {
      setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, isMobile]);

  const handleToggle = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleServiceClick = () => {
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={handleToggle}
          className="flex items-center justify-between w-full px-4 py-4 text-gray-900 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
        >
          <span className="text-base font-medium">{t('nav.services')}</span>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="bg-gray-50 border-b border-gray-100">
            {menuSections.map((section) => (
              <div key={section.key} className="px-4 py-3">
                <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={`${section.key}-${item.href}`}>
                      <Link
                        href={getLocalizedPath(item.href)}
                        onClick={handleServiceClick}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // DESKTOP VERSION - Menu collé au bas du header sans espace
  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 100); // Petit délai pour permettre le passage du bouton au menu
    setCloseTimeout(timeout);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bouton Services */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="nav-link text-xs lg:text-sm whitespace-nowrap text-black relative"
      >
        {t('nav.services')}
        <svg 
          className={`inline-block ml-1 w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu dropdown - fixed positionné EXACTEMENT au bas de la navbar */}
      {isOpen && menuTop > 0 && (
        <>
          {/* Pont invisible fixed pour combler l'espace entre le bouton et le menu */}
          {buttonRef.current && (() => {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const gap = menuTop - buttonRect.bottom;
            if (gap > 0) {
              return (
                <div
                  className="fixed z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    left: '0',
                    right: '0',
                    top: `${buttonRect.bottom}px`,
                    height: `${gap}px`,
                    pointerEvents: 'auto'
                  }}
                />
              );
            }
            return null;
          })()}
          
          {/* Overlay avec flou */}
          <div
            className="fixed left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
            style={{ 
              top: `${menuTop}px`,
              marginTop: '-2px' // Aligné avec le menu
            }}
          />
          
          {/* Menu principal - COLLÉ au bas de la navbar - COMPENSATION DU BOX-SHADOW */}
          <div
            ref={menuRef}
            className="fixed left-0 right-0 bg-white shadow-lg z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              top: `${menuTop}px`,
              marginTop: '-2px', // Compensation directe pour coller le menu
              paddingTop: '0px',
              paddingBottom: '1.5rem'
            }}
          >
            {/* Contenu du menu */}
            <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {menuSections.map((section) => (
                  <div key={section.key}>
                    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={`${section.key}-${item.href}`}>
                          <Link
                            href={getLocalizedPath(item.href)}
                            onClick={handleServiceClick}
                            className="group flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 transition-colors"
                          >
                            <span className="group-hover:font-medium">{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ServicesDropdown;
