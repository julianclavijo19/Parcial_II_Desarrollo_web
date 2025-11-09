/**
 * Utilidades para validar datos
 */

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} true si el email es válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} true si el teléfono es válido
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validar URL
 * @param {string} url - URL a validar
 * @returns {boolean} true si la URL es válida
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validar que un campo no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} true si el valor no está vacío
 */
export function isNotEmpty(value) {
  return value !== null && value !== undefined && value.toString().trim() !== '';
}

/**
 * Validar número
 * @param {string|number} value - Valor a validar
 * @returns {boolean} true si es un número válido
 */
export function isValidNumber(value) {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * Validar que un valor esté en un rango
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} true si está en el rango
 */
export function isInRange(value, min, max) {
  const numValue = parseFloat(value);
  return numValue >= min && numValue <= max;
}

