import { CURRENCY } from '../config/constants';

/**
 * Utilidades para formatear datos
 */

/**
 * Formatear moneda
 * @param {number} value - Valor a formatear
 * @param {string} currency - Código de moneda (default: USD)
 * @param {string} locale - Locale (default: es-ES)
 * @returns {string} Valor formateado como moneda
 */
export function formatCurrency(value, currency = CURRENCY.CODE, locale = CURRENCY.LOCALE) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Formatear fecha
 * @param {string|Date} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} Fecha formateada
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', { ...defaultOptions, ...options });
}

/**
 * Formatear número con separadores de miles
 * @param {number} value - Valor a formatear
 * @returns {string} Número formateado
 */
export function formatNumber(value) {
  return new Intl.NumberFormat('es-ES').format(value);
}

/**
 * Formatear porcentaje
 * @param {number} value - Valor a formatear (0-100)
 * @param {number} decimals - Número de decimales
 * @returns {string} Porcentaje formateado
 */
export function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncar texto
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Capitalizar primera letra
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

