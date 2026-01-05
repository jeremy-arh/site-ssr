'use client'

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCurrency } from '../contexts/CurrencyContext';

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

const CurrencySelector = ({ isWhite = false }) => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

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

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
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
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <span className="text-base lg:text-lg flex-shrink-0">{selectedCurrency.symbol}</span>
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
          className="fixed bg-white rounded-lg shadow-xl py-1 max-h-96 overflow-y-auto border border-gray-200"
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

export default CurrencySelector;
