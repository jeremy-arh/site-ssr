'use client'

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';

const LANGUAGE_NAMES = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
};

// SVG Flags inline pour éviter les requêtes externes (flagcdn.com)
const FlagGB = () => (
  <svg className="w-5 h-4" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);
const FlagFR = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#fff" d="M0 0h640v480H0z"/>
      <path fill="#00267f" d="M0 0h213.3v480H0z"/>
      <path fill="#f31830" d="M426.7 0H640v480H426.7z"/>
    </g>
  </svg>
);
const FlagES = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
    <path fill="#aa151b" d="M0 0h640v480H0z"/>
    <path fill="#f1bf00" d="M0 120h640v120H0z"/>
  </svg>
);
const FlagDE = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
    <path fill="#000" d="M0 0h640v160H0z"/>
    <path fill="#dd0000" d="M0 160h640v160H0z"/>
    <path fill="#ffce00" d="M0 320h640v160H0z"/>
  </svg>
);
const FlagIT = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#fff" d="M0 0h640v480H0z"/>
      <path fill="#009246" d="M0 0h213.3v480H0z"/>
      <path fill="#ce2b37" d="M426.7 0H640v480H426.7z"/>
    </g>
  </svg>
);
const FlagPT = () => (
  <svg className="w-5 h-4" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="400" fill="#060"/>
    <rect width="240" height="400" fill="#FF0000"/>
    <circle cx="240" cy="200" r="80" fill="#FFFF00" stroke="#000" strokeWidth="4"/>
    <circle cx="240" cy="200" r="60" fill="none" stroke="#000" strokeWidth="8"/>
    <path d="M 240 140 v 40 M 240 220 v 40 M 200 200 h 40 M 280 200 h 40" stroke="#000" strokeWidth="6"/>
  </svg>
);

const FLAG_COMPONENTS = {
  en: FlagGB,
  fr: FlagFR,
  es: FlagES,
  de: FlagDE,
  it: FlagIT,
  pt: FlagPT,
};

const getFlagComponent = (lang) => {
  return FLAG_COMPONENTS[lang] || FlagGB;
};

const LanguageSelector = ({ isWhite = false }) => {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Ferme le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOnButton = buttonRef.current && buttonRef.current.contains(event.target);
      const isClickOnDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      
      if (!isClickOnButton && !isClickOnDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      // Utiliser requestAnimationFrame pour éviter les forced layouts
      requestAnimationFrame(() => {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.left
        });
        setIsOpen(true);
      });
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full h-full">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`w-full h-full flex items-center px-2 lg:px-3 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
          isWhite 
            ? 'text-white hover:text-white/80 hover:bg-white/10' 
            : 'text-gray-700 hover:text-gray-900'
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
          {(() => {
            const FlagComponent = getFlagComponent(language);
            return <FlagComponent />;
          })()}
        </div>
        <svg
          className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform flex-shrink-0 ml-auto ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-white rounded-lg shadow-xl py-1 border border-gray-200"
          style={{ 
            top: position.top,
            left: position.left,
            width: typeof window !== 'undefined' && window.innerWidth >= 768 
              ? '200px' 
              : (buttonRef.current?.offsetWidth || 'auto'),
            minWidth: typeof window !== 'undefined' && window.innerWidth >= 768 
              ? '200px' 
              : (buttonRef.current?.offsetWidth || 'auto'),
            zIndex: 99999
          }}
        >
          {supportedLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                language === lang ? 'bg-gray-50 font-semibold' : ''
              }`}
            >
              {(() => {
                const FlagComponent = getFlagComponent(lang);
                return <FlagComponent />;
              })()}
              <span>{LANGUAGE_NAMES[lang]}</span>
              {language === lang && (
                <svg
                  className="w-4 h-4 ml-auto text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default LanguageSelector;
