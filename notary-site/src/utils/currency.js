/**
 * Currency detection and conversion utility
 * Detects user's currency based on IP geolocation and converts EUR prices
 */

const CURRENCY_CACHE_KEY = 'user_currency';
const CURRENCY_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const EXCHANGE_RATE_CACHE_KEY = 'exchange_rates';
const EXCHANGE_RATE_CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Currency symbols mapping
const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹',
  BRL: 'R$',
  MXN: '$',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  RON: 'lei',
  BGN: 'лв',
  HRK: 'kn',
  RUB: '₽',
  TRY: '₺',
  ZAR: 'R',
  KRW: '₩',
  SGD: 'S$',
  HKD: 'HK$',
  NZD: 'NZ$',
  THB: '฿',
  MYR: 'RM',
  PHP: '₱',
  IDR: 'Rp',
  VND: '₫',
};

// Default currency fallback
const DEFAULT_CURRENCY = 'EUR';

/**
 * Get currency from cache
 */
export const getCachedCurrency = () => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CURRENCY_CACHE_KEY);
    if (cached) {
      const { currency, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CURRENCY_CACHE_TTL) {
        return currency;
      }
    }
  } catch (error) {
    console.warn('Error reading currency cache:', error);
  }
  return null;
};

/**
 * Save currency to cache
 */
const saveCurrencyToCache = (currency) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify({
      currency,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Error saving currency cache:', error);
  }
};

/**
 * Get exchange rates from cache
 */
const getCachedExchangeRates = () => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY);
    if (cached) {
      const { rates, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < EXCHANGE_RATE_CACHE_TTL) {
        return rates;
      }
    }
  } catch (error) {
    console.warn('Error reading exchange rates cache:', error);
  }
  return null;
};

/**
 * Save exchange rates to cache
 */
const saveExchangeRatesToCache = (rates) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EXCHANGE_RATE_CACHE_KEY, JSON.stringify({
      rates,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Error saving exchange rates cache:', error);
  }
};

/**
 * Detect user's currency - SYNCHRONE, pas d'appel API pour éviter CLS
 * Utilise uniquement la locale du navigateur
 */
export const detectCurrencyFromIP = async () => {
  // Check cache first
  const cached = getCachedCurrency();
  if (cached) {
    return cached;
  }

  // PAS d'appel API ipapi.co - utiliser uniquement la locale du navigateur
  // Cela évite le CLS causé par le changement de devise après le rendu initial
  return detectCurrencyFromLocale();
};

/**
 * Detect currency from browser locale as fallback
 */
const detectCurrencyFromLocale = () => {
  try {
    const locale = navigator.language || navigator.userLanguage;
    const region = locale.split('-')[1] || locale.split('_')[1];
    
    // Map common regions to currencies
    const regionToCurrency = {
      'US': 'USD',
      'GB': 'GBP',
      'CA': 'CAD',
      'AU': 'AUD',
      'JP': 'JPY',
      'CH': 'CHF',
      'CN': 'CNY',
      'IN': 'INR',
      'BR': 'BRL',
      'MX': 'MXN',
      'SE': 'SEK',
      'NO': 'NOK',
      'DK': 'DKK',
      'PL': 'PLN',
      'CZ': 'CZK',
      'HU': 'HUF',
      'RO': 'RON',
      'BG': 'BGN',
      'HR': 'HRK',
      'RU': 'RUB',
      'TR': 'TRY',
      'ZA': 'ZAR',
      'KR': 'KRW',
      'SG': 'SGD',
      'HK': 'HKD',
      'NZ': 'NZD',
      'TH': 'THB',
      'MY': 'MYR',
      'PH': 'PHP',
      'ID': 'IDR',
      'VN': 'VND',
    };

    const currency = regionToCurrency[region] || DEFAULT_CURRENCY;
    saveCurrencyToCache(currency);
    return currency;
  } catch (error) {
    console.warn('Error detecting currency from locale:', error);
    return DEFAULT_CURRENCY;
  }
};

/**
 * Taux de change fixes depuis EUR - PAS D'APPEL API pour éviter 1000ms+ de latence
 * Ces taux sont approximatifs et mis à jour manuellement
 * Dernière mise à jour: Décembre 2024
 */
const FIXED_EXCHANGE_RATES = {
  EUR: 1,
  USD: 1.05,
  GBP: 0.86,
  CAD: 1.47,
  AUD: 1.65,
  JPY: 162,
  CHF: 0.94,
  CNY: 7.65,
  INR: 88,
  BRL: 6.4,
  MXN: 21.5,
  SEK: 11.5,
  NOK: 11.8,
  DKK: 7.46,
  PLN: 4.32,
  CZK: 25.3,
  HUF: 405,
  RON: 4.97,
  BGN: 1.96,
  HRK: 7.53,
  RUB: 105,
  TRY: 36,
  ZAR: 19.5,
  KRW: 1450,
  SGD: 1.42,
  HKD: 8.2,
  NZD: 1.82,
  THB: 37,
  MYR: 4.7,
  PHP: 61,
  IDR: 17000,
  VND: 26500,
};

/**
 * Get exchange rates - SYNCHRONE, pas d'appel API
 */
const fetchExchangeRates = async () => {
  // Utiliser les taux fixes pour éviter la latence
  return FIXED_EXCHANGE_RATES;
};

/**
 * Convert EUR price to target currency
 */
export const convertPrice = async (eurPrice, targetCurrency = null) => {
  if (!eurPrice || !targetCurrency || targetCurrency === 'EUR') {
    return {
      amount: eurPrice,
      currency: 'EUR',
      symbol: '€',
      formatted: `${eurPrice}€`
    };
  }

  try {
    const rates = await fetchExchangeRates();
    
    if (!rates || !rates[targetCurrency]) {
      // Fallback to EUR if conversion fails
      return {
        amount: eurPrice,
        currency: 'EUR',
        symbol: '€',
        formatted: `${eurPrice}€`
      };
    }

    const rate = rates[targetCurrency];
    const convertedAmount = Math.round(eurPrice * rate * 100) / 100; // Round to 2 decimals
    
    const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;
    
    // Format based on currency
    let formatted;
    if (targetCurrency === 'JPY' || targetCurrency === 'KRW' || targetCurrency === 'VND') {
      // No decimals for these currencies
      formatted = `${symbol}${Math.round(convertedAmount)}`;
    } else {
      formatted = `${symbol}${convertedAmount.toFixed(2)}`;
    }

    return {
      amount: convertedAmount,
      currency: targetCurrency,
      symbol,
      formatted
    };
  } catch (error) {
    console.warn('Error converting price:', error);
    // Fallback to EUR
    return {
      amount: eurPrice,
      currency: 'EUR',
      symbol: '€',
      formatted: `${eurPrice}€`
    };
  }
};

/**
 * Initialize currency detection
 * Call this on app load
 */
export const initializeCurrency = async () => {
  try {
    const currency = await detectCurrencyFromIP();
    return currency;
  } catch (error) {
    console.warn('Error initializing currency:', error);
    return DEFAULT_CURRENCY;
  }
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency) => {
  return CURRENCY_SYMBOLS[currency] || currency;
};









