import apiClient from '../../config/api';
import { GAMING_CATEGORIES, CATEGORY_INFO } from '../../config/constants';

/**
 * Servicio para gestionar categorías
 */
class CategoryService {
  /**
   * Obtener todas las categorías disponibles (solo gaming/tech)
   * @returns {Promise} Lista de categorías
   */
  async getCategories() {
    try {
      const response = await apiClient.get('/products/categories');
      let allCategories = [];
      
      if (Array.isArray(response.data)) {
        allCategories = response.data;
      } else if (response.data && Array.isArray(response.data.categories)) {
        allCategories = response.data.categories;
      } else {
        console.warn('La API no devolvió un array de categorías, usando categorías por defecto');
        return GAMING_CATEGORIES;
      }
      
      // Filtrar solo categorías gaming/tech que existen en la API
      const filtered = GAMING_CATEGORIES.filter(cat => allCategories.includes(cat));
      
      // Si no se encontraron categorías después del filtro, devolver las por defecto
      return filtered.length > 0 ? filtered : GAMING_CATEGORIES;
    } catch (error) {
      console.error('Error al obtener categorías desde API, usando categorías por defecto:', error);
      return GAMING_CATEGORIES;
    }
  }

  /**
   * Obtener información de una categoría
   * @param {string} categorySlug - Slug de la categoría
   * @returns {Object} Información de la categoría
   */
  getCategoryInfo(categorySlug) {
    return CATEGORY_INFO[categorySlug] || null;
  }

  /**
   * Mapear categorías con su información para UI
   * @param {Array} categories - Array de slugs de categorías
   * @returns {Array} Array de objetos con información de categorías
   */
  mapCategories(categories) {
    return categories
      .filter(slug => CATEGORY_INFO[slug])
      .map(slug => ({
        slug,
        ...CATEGORY_INFO[slug]
      }));
  }

  /**
   * Obtener nombre legible de categoría
   * @param {string} category - Slug de la categoría
   * @returns {string} Nombre formateado
   */
  getCategoryName(category) {
    return CATEGORY_INFO[category]?.name || category;
  }
}

// Exportar una instancia única del servicio (Singleton)
export default new CategoryService();

