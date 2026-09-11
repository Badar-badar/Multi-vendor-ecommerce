import { useState, useMemo } from 'react';

// Price modifiers table for dynamic variant pricing
const variantPriceModifiers = {
  // Metals
  Platinum: 350,
  '18k Rose Gold': 80,
  '18k Yellow Gold': 0,

  // Lengths
  '18 inch': 120,
  '16 inch': 60,
  '14 inch': 0,

  // Sizing
  XL: 40,
  L: 20,
  M: 0,
  S: 0,

  // Leather Finishes
  'Midnight Black': 30,
  Oxblood: 20,
  'British Tan': 0,
};

// Swatch colors for visual variant selection
export const swatchColorMap = {
  Camel: '#C19A6B',
  'Midnight Slate': '#1E293B',
  Champagne: '#F7E7CE',
  '18k Yellow Gold': '#E5C158',
  '18k Rose Gold': '#B76E79',
  Platinum: '#E5E4E2',
  'Cognac Tan': '#9E5B32',
  'Espresso Dark Brown': '#3B2F2F',
  'Jet Black': '#121212',
  'Midnight Black': '#1A1A1A',
  Oxblood: '#4A0E17',
  'British Tan': '#A0522D',
  'Smoked Ash': '#708090',
  'Speckled Sand': '#D2B48C',
  'Obsidian Matte': '#262626',
  'Oatmeal Melange': '#D7C4B7',
  Charcoal: '#36454F',
  Ivory: '#FFFFF0',
};

export const useProductVariants = (product) => {
  // Initialize default selected variants (first option of each group)
  const initialSelected = useMemo(() => {
    if (!product?.variants) return {};
    const defaults = {};
    product.variants.forEach((v) => {
      if (v.options?.length > 0) {
        defaults[v.name] = v.options[0];
      }
    });
    return defaults;
  }, [product]);

  const [selectedVariants, setSelectedVariants] = useState(initialSelected);

  // Calculate adjusted price based on selected variants
  const adjustedPrice = useMemo(() => {
    if (!product) return 0;
    let base = product.price;

    Object.values(selectedVariants).forEach((optionVal) => {
      if (variantPriceModifiers[optionVal]) {
        base += variantPriceModifiers[optionVal];
      }
    });

    return base;
  }, [product, selectedVariants]);

  // Calculate adjusted original price
  const adjustedComparePrice = useMemo(() => {
    if (!product?.compareAtPrice) return null;
    let base = product.compareAtPrice;

    Object.values(selectedVariants).forEach((optionVal) => {
      if (variantPriceModifiers[optionVal]) {
        base += variantPriceModifiers[optionVal];
      }
    });

    return base;
  }, [product, selectedVariants]);

  // Calculate stock count for current combination
  const stockAvailable = useMemo(() => {
    if (!product) return 0;
    return product.stockCount || 10;
  }, [product]);

  const selectVariant = (groupName, optionValue) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [groupName]: optionValue,
    }));
  };

  return {
    selectedVariants,
    selectVariant,
    adjustedPrice,
    adjustedComparePrice,
    stockAvailable,
  };
};

export default useProductVariants;
