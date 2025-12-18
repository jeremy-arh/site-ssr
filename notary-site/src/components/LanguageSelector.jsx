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
  <svg className="w-5 h-4" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="gb"><path fillOpacity=".7" d="M-85.3 0h682.6v512h-682.6z"/></clipPath></defs>
    <g clipPath="url(#gb)" transform="translate(80) scale(.94)">
      <g strokeWidth="1pt">
        <path fill="#006" d="M-256 0H768v512H-256z"/>
        <path fill="#fff" d="m-256 0 582.3 198.4L768 0v198.4L-256 512V0z" transform="scale(1.3)"/>
        <path fill="#fff" d="M768 0v512L-256 313.6V0z" transform="scale(1.3)"/>
        <path fill="#c00" d="M-256 0v512L768 198.4V0z" transform="scale(1.3)"/>
        <path fill="#c00" d="M768 0v198.4L-256 512V313.6z" transform="scale(1.3)"/>
      </g>
    </g>
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
  <svg className="w-5 h-4" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
    <path fill="#060" d="M0 0h640v480H0z"/>
    <path fill="#ff0000" d="M0 0h256v256H0z"/>
    <circle cx="128" cy="128" r="64" fill="#ff0"/>
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
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors rounded-lg whitespace-nowrap flex-shrink-0 ${
          isWhite 
            ? 'text-white hover:text-white/80 hover:bg-white/10' 
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        {(() => {
          const FlagComponent = getFlagComponent(language);
          return <FlagComponent />;
        })()}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
          className="fixed w-48 bg-white rounded-lg shadow-xl py-1 border border-gray-200"
          style={{ 
            top: position.top,
            left: position.left,
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
