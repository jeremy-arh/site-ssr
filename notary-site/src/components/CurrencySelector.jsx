'use client'

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCurrency } from '../contexts/CurrencyContext';

// formkit:multicurrency - icône multi-devises FormKit (inline pour éviter @iconify)
const IconMultiCurrency = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M9.73,16c-2.82,0-5.12-2.29-5.12-5.12,0-1.9,1.04-3.63,2.72-4.52,.24-.13,.55-.04,.68,.21,.13,.24,.04,.55-.21,.68-1.35,.72-2.19,2.11-2.19,3.64,0,2.27,1.85,4.12,4.12,4.12s4.12-1.85,4.12-4.12c0-.83-.25-1.63-.71-2.31-.16-.23-.1-.54,.13-.69,.23-.16,.54-.1,.69,.13,.58,.85,.89,1.85,.89,2.88,0,2.82-2.29,5.12-5.12,5.12Z" />
    <path d="M11.5,14h-3.55c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5h3.55c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" />
    <path d="M10.09,12h-2.13c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5h2.13c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" />
    <path d="M8.67,13.87c-.28,0-.5-.22-.5-.5v-3.46c0-.77,.43-1.45,1.11-1.8,.25-.12,.55-.02,.67,.22,.12,.25,.02,.55-.22,.67-.34,.17-.56,.52-.56,.9v3.46c0,.28-.22,.5-.5,.5Z" />
    <path d="M11.32,9.37c-2.58,0-4.68-2.1-4.68-4.68S8.74,0,11.32,0s4.68,2.1,4.68,4.68-2.1,4.68-4.68,4.68Zm0-8.37c-2.03,0-3.68,1.65-3.68,3.68s1.65,3.68,3.68,3.68,3.68-1.65,3.68-3.68-1.65-3.68-3.68-3.68Z" />
    <path d="M11.25,7.43c-.97,0-1.75-.79-1.75-1.75V3.68c0-.97,.79-1.75,1.75-1.75s1.75,.79,1.75,1.75c0,.28-.22,.5-.5,.5s-.5-.22-.5-.5c0-.41-.34-.75-.75-.75s-.75,.34-.75,.75v2c0,.41,.34,.75,.75,.75s.75-.34,.75-.75c0-.28,.22-.5,.5-.5s.5,.22,.5,.5c0,.97-.79,1.75-1.75,1.75Z" />
    <path d="M11,4.46h-1.5c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5h1.5c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" />
    <path d="M11,6h-1.5c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5h1.5c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" />
    <path d="M5.4,13.4c-2.98,0-5.4-2.42-5.4-5.4S2.42,2.6,5.4,2.6c.72,0,1.41,.14,2.07,.41,.26,.11,.38,.4,.27,.65-.11,.26-.4,.38-.65,.27-.53-.22-1.1-.33-1.68-.33-2.43,0-4.4,1.98-4.4,4.4s1.98,4.4,4.4,4.4c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" />
    <path d="M5.47,9.5c-.28,0-.5-.22-.5-.5V4.85c0-.28,.22-.5,.5-.5s.5,.22,.5,.5v4.15c0,.28-.22,.5-.5,.5Z" />
    <path d="M5.3,8.5c-.95,0-1.73-.77-1.73-1.73s.77-1.73,1.73-1.73h.35c.95,0,1.73,.77,1.73,1.73v.18c0,.28-.22,.5-.5,.5s-.5-.22-.5-.5v-.18c0-.4-.33-.73-.73-.73h-.35c-.4,0-.73,.33-.73,.73s.33,.73,.73,.73c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" />
    <path d="M5,10.92s-.08,0-.12-.02c-.77-.19-1.31-.88-1.31-1.67v-.18c0-.28,.22-.5,.5-.5s.5,.22,.5,.5v.18c0,.33,.23,.62,.55,.7,.27,.07,.43,.34,.36,.61-.06,.23-.26,.38-.48,.38Z" />
  </svg>
);

const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
];

const CurrencySelector = ({ isWhite = false, mobileModal = false }) => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (mobileModal) return;
    const handleClickOutside = (event) => {
      const isClickOnButton = buttonRef.current && buttonRef.current.contains(event.target);
      const isClickOnDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      if (!isClickOnButton && !isClickOnDropdown) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, mobileModal]);

  const handleToggle = () => {
    if (mobileModal) {
      setIsOpen(true);
      return;
    }
    if (!isOpen && buttonRef.current) {
      requestAnimationFrame(() => {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({ top: rect.bottom + 8, left: rect.left });
        setIsOpen(true);
      });
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  useEffect(() => {
    if (mobileModal && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileModal, isOpen]);

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
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <IconMultiCurrency className="w-5 h-5 lg:w-5 lg:h-5 flex-shrink-0" />
        <svg
          className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform flex-shrink-0 ml-auto ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {mobileModal && isOpen && createPortal(
        <div ref={dropdownRef} className="fixed inset-0 z-[99999] bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Currency</h3>
            <button onClick={() => setIsOpen(false)} className="p-2 -m-2" aria-label="Close">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth={2} />
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth={2} />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className={`w-full text-left px-4 py-4 text-base hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  currency === curr.code ? 'bg-gray-50 font-semibold' : ''
                }`}
              >
                <span className="text-lg">{curr.symbol}</span>
                <span>{curr.name}</span>
                {currency === curr.code && (
                  <svg className="w-5 h-5 ml-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}

      {!mobileModal && isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-white rounded-lg shadow-xl py-1 max-h-96 overflow-y-auto border border-gray-200"
          style={{ top: position.top, left: position.left, width: '200px', minWidth: '200px', zIndex: 99999 }}
        >
          {CURRENCIES.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencyChange(curr.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                currency === curr.code ? 'bg-gray-50 font-semibold' : ''
              }`}
            >
              <span className="text-lg">{curr.code.toLowerCase()}</span>
              <span>{curr.symbol}</span>
              {currency === curr.code && (
                <svg className="w-4 h-4 ml-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default CurrencySelector;
