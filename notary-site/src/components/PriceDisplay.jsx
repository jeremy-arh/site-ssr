'use client'

import { useState, useEffect } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Component to display price with currency conversion
 * 
 * EUR, USD, GBP : prix fixes stockés en DB (base_price, price_usd, price_gbp)
 * Autres devises : conversion dynamique depuis base_price (EUR)
 */
const PriceDisplay = ({ 
  price,           // Prix EUR (base_price)
  priceUsd = null, // Prix USD fixe (depuis DB)
  priceGbp = null, // Prix GBP fixe (depuis DB)
  showFrom = false, 
  className = '' 
}) => {
  const { currency, formatPrice } = useCurrency();
  const { t } = useTranslation();
  const [formattedPrice, setFormattedPrice] = useState(`${price}€`);

  useEffect(() => {
    if (!price) return;

    // EUR, USD, GBP = prix fixes depuis la DB
    if (currency === 'EUR') {
      setFormattedPrice(`${price}€`);
    } else if (currency === 'USD' && priceUsd != null) {
      setFormattedPrice(`$${Number(priceUsd).toFixed(2)}`);
    } else if (currency === 'GBP' && priceGbp != null) {
      setFormattedPrice(`£${Number(priceGbp).toFixed(2)}`);
    } else {
      // Autres devises = conversion dynamique depuis EUR
      formatPrice(price).then(setFormattedPrice);
    }
  }, [price, priceUsd, priceGbp, currency, formatPrice]);

  if (!price) return null;

  return (
    <span className={className}>
      {formattedPrice}
      {showFrom && <span className="text-xs text-gray-500 ml-2 font-normal">{t('services.perDocument')} - no hidden fee</span>}
    </span>
  );
};

export default PriceDisplay;




