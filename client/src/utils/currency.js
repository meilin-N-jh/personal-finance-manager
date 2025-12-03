// Currency utilities for personal finance manager

export const getCurrencySymbol = (currency) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    HKD: 'HK$'
  };
  return symbols[currency] || '$';
};

export const getCurrencyLocale = (currency) => {
  const locales = {
    USD: 'en-US',
    EUR: 'en-EU',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    CNY: 'zh-CN',
    HKD: 'en-HK'
  };
  return locales[currency] || 'en-US';
};

export const formatCurrency = (amount, currency = null) => {
  // Get currency from localStorage or use provided currency
  const userCurrency = currency || localStorage.getItem('userCurrency') || 'HKD';

  return new Intl.NumberFormat(getCurrencyLocale(userCurrency), {
    style: 'currency',
    currency: userCurrency
  }).format(amount);
};

export const getUserCurrency = () => {
  return localStorage.getItem('userCurrency') || 'HKD';
};