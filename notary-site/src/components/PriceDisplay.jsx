'use client'

import { useState, useEffect } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Component to display price with automatic currency conversion
 */
const PriceDisplay = ({ price, showFrom = false, className = '' }) => {
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
  const [formattedPrice, setFormattedPrice] = useState(`${price}€`);

  useEffect(() => {
    if (price) {
      formatPrice(price).then(setFormattedPrice);
    }
  }, [price, formatPrice]);

  if (!price) return null;

  return (
    <span className={className}>
      {formattedPrice}
      {showFrom && <span className="text-xs text-gray-500 ml-2 font-normal">{t('services.perDocument')} - no hidden fee</span>}
    </span>
  );
};

export default PriceDisplay;




